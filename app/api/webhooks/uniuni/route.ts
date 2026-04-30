import { NextResponse } from 'next/server';
import { headers } from 'next/headers';
import crypto from 'crypto';
import { prisma } from '@/lib/prisma';

const WEBHOOK_SECRET = process.env.UNIUNI_WEBHOOK_SECRET;
const SIGNATURE_HEADER = 'x-webhook-signature';

// UniUni statuses that map to a change in our OrderStatus.
// All others are logged and ignored.
const STATUS_MAP: Partial<Record<string, 'SHIPPED' | 'DELIVERED'>> = {
  OUT_FOR_DELIVERY: 'SHIPPED',
  DELIVERED: 'DELIVERED',
};

export async function POST(request: Request) {
  const body = await request.text();
  const headersList = await headers();

  // Verify HMAC-SHA256 signature when a secret is configured.
  // Skip verification only if UNIUNI_WEBHOOK_SECRET is intentionally unset
  // (e.g. during local development with No Auth mode in the portal).
  if (WEBHOOK_SECRET) {
    const signature = headersList.get(SIGNATURE_HEADER);

    if (!signature) {
      return NextResponse.json({ error: 'Missing signature' }, { status: 401 });
    }

    const computed = crypto
      .createHmac('sha256', WEBHOOK_SECRET)
      .update(body)
      .digest('hex');

    let valid = false;
    try {
      valid = crypto.timingSafeEqual(
        Buffer.from(computed, 'hex'),
        Buffer.from(signature, 'hex'),
      );
    } catch {
      // Buffer length mismatch — signature is invalid
    }

    if (!valid) {
      console.error('❌ UniUni webhook: invalid HMAC signature');
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }
  }

  let event: UniUniWebhookPayload;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📬 UniUni Webhook Received');
  console.log(`   Event: ${event.event}`);
  console.log(`   Version: ${event.version}`);
  console.log('   Payload:', JSON.stringify(event.data, null, 2));
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

  try {
    switch (event.event) {
      case 'shipment.status_updated':
        await handleShipmentStatusUpdated(
          event.data as unknown as ShipmentEventData,
        );
        break;
      case 'shipment.custom_event':
        console.log(
          'UniUni custom shipment event:',
          JSON.stringify(event.data),
        );
        break;
      case 'insurance.status_updated':
        console.log('UniUni insurance event:', JSON.stringify(event.data));
        break;
      default:
        console.log(`UniUni unhandled event type: ${event.event}`);
    }
  } catch (error) {
    console.error('❌ UniUni webhook handler error:', error);
    // Return 200 so UniUni doesn't retry — handler errors should be investigated
    // via logs, not retried (retries won't fix a DB or logic error).
    return NextResponse.json({ received: true, warning: 'Handler error' });
  }

  return NextResponse.json({ received: true });
}

async function handleShipmentStatusUpdated(data: ShipmentEventData) {
  const { trackingId, status } = data;

  console.log(`📦 UniUni shipment ${trackingId} → ${status}`);

  const orderStatus = STATUS_MAP[status];
  if (!orderStatus) {
    console.log(`UniUni status "${status}" — no order update needed`);
    return;
  }

  const order = await prisma.order.findFirst({
    where: { trackingNumber: trackingId },
  });

  if (!order) {
    console.error(
      `❌ UniUni webhook: no order found for trackingId ${trackingId}`,
    );
    return;
  }

  await prisma.order.update({
    where: { id: order.id },
    data: { status: orderStatus },
  });

  console.log(
    `✅ Order ${order.orderNumber} → ${orderStatus} (trackingId: ${trackingId})`,
  );
}

interface UniUniWebhookPayload {
  event: string;
  version: string;
  data: Record<string, unknown>;
}

interface ShipmentEventData {
  objectType: 'Shipment';
  trackingId: string;
  status: string;
  statusCode: number;
  updatedAt: string;
  address?: object;
  transferCarrierName?: string;
  transferCarrierTrackingId?: string;
  proofOfDelivery?: object;
}
