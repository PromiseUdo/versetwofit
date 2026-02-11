// src/app/order-confirmation/page.tsx
'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import {
  CheckCircle,
  Package,
  Truck,
  Mail,
  Download,
  Loader2,
  Home,
} from 'lucide-react';
import { formatCurrency } from '@/lib/shipping';
import MaxWidthWrapper from '@/components/max-width-wrapper';

interface OrderDetails {
  id: string;
  orderNumber: string;
  totalAmount: number;
  status: string;
  paymentStatus: string;
  customerEmail: string;
  shippingAddress: any;
  shippingFirstName: string;
  shippingLastName: string;
  shippingStreet: string;
  shippingApartment: string;
  shippingCity: string;
  shippingProvince: string;
  shippingPostalCode: string;
  shippingCountry: string;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    image: string | null;
    quantity: number;
    price: number;
  }>;
}

function OrderConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
 
  useEffect(() => {
    const orderId = searchParams.get('order_id');

    if (!orderId) {
      router.push('/');
      return;
    }

    fetchOrderDetails(orderId);
  }, [searchParams]);

  const fetchOrderDetails = async (orderId: string) => {
    try {
      const response = await axios.get(`/api/orders/${orderId}`);
      setOrder(response.data);
    } catch (err: any) {
      console.error('Failed to fetch order:', err);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Package className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <p className="text-gray-600 mb-6">
            {error || 'We couldn&apos;t find your order details'}
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition"
          >
            <Home size={20} />
            Go to Homepage
          </Link>
        </div>
      </div>
    );
  }

  return (

    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
     <MaxWidthWrapper className="my-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Success Header */}
        <div className="bg-white rounded-2xl shadow-sm p-8 mb-8 text-center">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-12 h-12 text-primary" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-lg text-gray-600 mb-6">
            Thank you for your purchase. Your order has been received and is
            being processed.
          </p>

          <div className="flex items-center justify-center gap-2 text-sm text-gray-600 mb-4">
            <span>Order Number:</span>
            <span className="font-mono font-bold text-gray-900 text-lg">
              {order.orderNumber}
            </span>
          </div>

          <p className="text-sm text-gray-600">
            A confirmation email has been sent to{' '}
            <span className="font-medium text-gray-900">
              {order.customerEmail}
            </span>
          </p>
        </div>

        {/* Quick Actions */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <Mail className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Check Email</h3>
            <p className="text-sm text-gray-600">
              Confirmation sent to your inbox
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <Truck className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">Track Order</h3>
            <p className="text-sm text-gray-600">
              You'll receive tracking info soon
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6 text-center hover:shadow-md transition">
            <Package className="w-8 h-8 mx-auto text-primary mb-3" />
            <h3 className="font-semibold text-gray-900 mb-1">View Orders</h3>
            <p className="text-sm text-gray-600">Check status anytime</p>
          </div>
        </div> */}

        {/* Order Details */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">
            Order Details
          </h2>

          {/* Items */}
          <div className="space-y-4 mb-6">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 pb-4 border-b last:border-0"
              >
                <div className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{item.name}</p>
                  <p className="text-sm text-gray-600">Qty: {item.quantity}</p>
                </div>
                <p className="font-semibold text-gray-900">
                  {formatCurrency(item.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>

          {/* Totals */}
          <div className="space-y-2 pt-4 border-t">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold">
                {formatCurrency(order.totalAmount)}
              </span>
            </div>
            <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
              <span>Total Paid</span>
              <span>{formatCurrency(order.totalAmount)}</span>
            </div>
          </div>
        </div>

        {/* Shipping Information */}
        <div className="bg-white rounded-xl shadow-sm p-8 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Shipping Information
          </h2>
          <div className="text-gray-600 space-y-1">
            <p className="font-medium text-gray-900">
              {order.shippingFirstName} {order.shippingLastName}
            </p>
            <p>{order.shippingStreet}</p>
            {order.shippingApartment && (
              <p>{order.shippingApartment}</p>
            )}
            <p>
              {order.shippingCity}, {order.shippingProvince}{' '}
              {order.shippingPostalCode}
            </p>
            <p>{order.shippingCountry || 'United States'}</p>
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-primary/5 rounded-xl p-8 border border-primary/20 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            What Happens Next?
          </h2>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                1
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  Order Processing (1-2 business days)
                </p>
                <p className="text-sm text-gray-600">
                  We're preparing your items for shipment
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                2
              </div>
              <div>
                <p className="font-semibold text-gray-900">Shipping</p>
                <p className="text-sm text-gray-600">
                  You'll receive tracking information via email
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center flex-shrink-0 font-bold">
                3
              </div>
              <div>
                <p className="font-semibold text-gray-900">Delivery</p>
                <p className="text-sm text-gray-600">
                  Your order arrives at your doorstep
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            href="/orders"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition font-semibold"
          >
            <Package size={20} />
            View All Orders
          </Link>
          <Link
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition font-semibold"
          >
            <Home size={20} />
            Continue Shopping
          </Link>
        </div>

        {/* Support */}
        <div className="text-center mt-8 text-sm text-gray-600">
          <p>
            Need help?{' '}
            <Link href="/support" className="text-primary hover:underline">
              Contact Support
            </Link>
          </p>
        </div>
      </div>
    </MaxWidthWrapper>
    </>
   
  );
}

export default function OrderConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
        </div>
      }
    >
      <OrderConfirmationContent />
    </Suspense>
  );
}
