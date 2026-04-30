// src/app/orders/[id]/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  Package,
  Truck,
  CheckCircle,
  MapPin,
  CreditCard,
  Calendar,
  Mail,
  Phone,
  Loader2,
  Download,
  MessageCircle,
  ArrowRight,
} from 'lucide-react';
import { formatCurrency } from '@/lib/shipping';
import toast from 'react-hot-toast';
import MaxWidthWrapper from '@/components/max-width-wrapper';

interface OrderDetails {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  subtotal: number;
  shippingCost: number;
  tax: number;
  totalAmount: number;
  customerEmail: string;
  customerPhone: string | null;
  shippingAddress: string | null;
  shippingFirstName: string;
  shippingLastName: string;
  shippingCountry: string;
  shippingPostalCode: string;
  shippingProvince: string;
  shippingStreet: string;
  shippingCity: string;
  trackingNumber: string | null;
  // shippingAddress: {
  //   firstName: string;
  //   lastName: string;
  //   street: string;
  //   apartment?: string;
  //   city: string;
  //   state: string;
  //   zipCode: string;
  //   country: string;
  // };
  billingAddress: any;
  createdAt: string;
  items: Array<{
    id: string;
    name: string;
    image: string | null;
    quantity: number;
    price: number;
    productSlug: string;
  }>;
}

type TimelineStep = {
  label: string;
  completed: boolean;
  cancelled?: boolean;
};

// const ORDER_TIMELINE = {
//   PENDING: [
//     { label: 'Order Placed', completed: true },
//     { label: 'Processing', completed: false },
//     { label: 'Shipped', completed: false },
//     { label: 'Delivered', completed: false },
//   ],
//   PROCESSING: [
//     { label: 'Order Placed', completed: true },
//     { label: 'Processing', completed: true },
//     { label: 'Shipped', completed: false },
//     { label: 'Delivered', completed: false },
//   ],
//   SHIPPED: [
//     { label: 'Order Placed', completed: true },
//     { label: 'Processing', completed: true },
//     { label: 'Shipped', completed: true },
//     { label: 'Delivered', completed: false },
//   ],
//   DELIVERED: [
//     { label: 'Order Placed', completed: true },
//     { label: 'Processing', completed: true },
//     { label: 'Shipped', completed: true },
//     { label: 'Delivered', completed: true },
//   ],
//   CANCELLED: [
//     { label: 'Order Placed', completed: true },
//     { label: 'Cancelled', completed: true, cancelled: true },
//   ],
// };

const ORDER_TIMELINE: Record<string, TimelineStep[]> = {
  PENDING: [
    { label: 'Order Placed', completed: true },
    { label: 'Processing', completed: false },
    { label: 'Shipped', completed: false },
    { label: 'Delivered', completed: false },
  ],
  PROCESSING: [
    { label: 'Order Placed', completed: true },
    { label: 'Processing', completed: true },
    { label: 'Shipped', completed: false },
    { label: 'Delivered', completed: false },
  ],
  SHIPPED: [
    { label: 'Order Placed', completed: true },
    { label: 'Processing', completed: true },
    { label: 'Shipped', completed: true },
    { label: 'Delivered', completed: false },
  ],
  DELIVERED: [
    { label: 'Order Placed', completed: true },
    { label: 'Processing', completed: true },
    { label: 'Shipped', completed: true },
    { label: 'Delivered', completed: true },
  ],
  CANCELLED: [
    { label: 'Order Placed', completed: true },
    { label: 'Cancelled', completed: true, cancelled: true },
  ],
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { status: authStatus } = useSession();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders');
    }
  }, [authStatus, router]);

  useEffect(() => {
    if (authStatus === 'authenticated' && params.id) {
      fetchOrderDetails();
    }
  }, [authStatus, params.id]);

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`/api/orders/${params.id}`);
      setOrder(response.data);

      console.log(response.data, 'order');
    } catch (error: any) {
      console.error('Failed to fetch order:', error);
      toast.error('Failed to load order details');
      if (error.response?.status === 404) {
        router.push('/orders');
      }
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      PENDING: 'bg-yellow-100 text-yellow-800',
      PROCESSING: 'bg-blue-100 text-blue-800',
      SHIPPED: 'bg-purple-100 text-purple-800',
      DELIVERED: 'bg-green-100 text-green-800',
      CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || colors.PENDING;
  };

  if (loading || authStatus === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-gray-600">Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Order Not Found
          </h2>
          <Link
            href="/orders"
            className="text-primary hover:text-primary/80 font-medium"
          >
            Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  const timeline =
    ORDER_TIMELINE[order.status as keyof typeof ORDER_TIMELINE] ||
    ORDER_TIMELINE.PENDING;

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      <div className="min-h-screen my-24">
        <MaxWidthWrapper className="">
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/orders"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition"
            >
              <ChevronLeft size={20} />
              Back to Orders
            </Link>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Order #{order.orderNumber}
                </h1>
                <p className="text-gray-600">
                  Placed on {formatDate(order.createdAt)}
                </p>
              </div>

              <span
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg font-semibold text-sm ${getStatusColor(
                  order.status,
                )}`}
              >
                {order.status === 'DELIVERED' && <CheckCircle size={18} />}
                {order.status === 'SHIPPED' && <Truck size={18} />}
                {order.status === 'PROCESSING' && <Package size={18} />}
                {order.status.replace('_', ' ')}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Timeline */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Order Timeline
                </h2>

                <div className="relative">
                  {timeline.map((step, index) => (
                    <div key={index} className="flex gap-4 pb-8 last:pb-0">
                      {/* Timeline Line */}
                      {index < timeline.length - 1 && (
                        <div className="absolute left-5 top-12 bottom-0 w-0.5 bg-gray-200" />
                      )}

                      {/* Timeline Dot */}
                      <div className="relative z-50">
                        <div
                          className={`w-10 h-10 rounded-full flex items-center justify-center ${
                            step.completed
                              ? step.cancelled
                                ? 'bg-red-100'
                                : 'bg-green-100'
                              : 'bg-gray-100'
                          }`}
                        >
                          {step.completed ? (
                            <CheckCircle
                              size={20}
                              className={
                                step.cancelled
                                  ? 'text-red-600'
                                  : 'text-green-600'
                              }
                            />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-400" />
                          )}
                        </div>
                      </div>

                      {/* Timeline Content */}
                      <div className="flex-1 pt-1">
                        <p
                          className={`font-semibold ${
                            step.completed ? 'text-gray-900' : 'text-gray-500'
                          }`}
                        >
                          {step.label}
                        </p>
                        {step.completed && index === 0 && (
                          <p className="text-sm text-gray-600 mt-1">
                            {formatDate(order.createdAt)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <h2 className="text-lg font-bold text-gray-900 mb-6">
                  Order Items ({order.items.length})
                </h2>

                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-4 p-4 rounded-lg hover:bg-gray-50 transition"
                    >
                      <Link
                        href={`/products/${item.productSlug}`}
                        className="relative w-24 h-24 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 group"
                      >
                        {item.image ? (
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover group-hover:scale-105 transition"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package className="w-8 h-8 text-gray-400" />
                          </div>
                        )}
                      </Link>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/products/${item.productSlug}`}
                          className="font-semibold text-gray-900 hover:text-primary transition line-clamp-2"
                        >
                          {item.name}
                        </Link>
                        <p className="text-sm text-gray-600 mt-1">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-sm font-medium text-gray-900 mt-2">
                          {formatCurrency(item.price)} each
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="font-bold text-gray-900 text-lg">
                          {formatCurrency(item.price * item.quantity)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Total Breakdown */}
                <div className="mt-6 pt-6 border-t space-y-3">
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.subtotal)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Delivery cost</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.shippingCost)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>Tax</span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(order.tax)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t">
                    <span className="text-lg font-bold text-gray-900">
                      Order Total
                    </span>
                    <span className="text-2xl font-bold text-gray-900">
                      {formatCurrency(order.totalAmount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="rounded-xl p-6 border border-primary/20">
                <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
                <div className="grid grid-cols-1  gap-3">
                  <button className="flex w-full items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition font-medium text-sm">
                    <MessageCircle size={18} className="text-primary" />
                    Contact Support
                  </button>
                  {/* <button className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-primary hover:bg-primary/5 transition font-medium text-sm">
                    <Download size={18} className="text-primary" />
                    Download Invoice
                  </button> */}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <MapPin className="text-primary" size={20} />
                  <h3 className="font-bold text-gray-900">Shipping Address</h3>
                </div>
                <div className="text-gray-700 space-y-1 text-sm">
                  <p className="font-medium text-gray-900">
                    {order.shippingFirstName} {order.shippingLastName}
                  </p>
                  <p>{order.shippingStreet}</p>
                  {/* {order.shippingAddress.apartment && (
                    <p>{order.shippingAddress.apartment}</p>
                  )} */}
                  <p>
                    {order.shippingCity}, {order.shippingProvince}{' '}
                    {order.shippingPostalCode}
                  </p>
                  <p>{order.shippingCountry || 'Canada'}</p>
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="text-primary" size={20} />
                  <h3 className="font-bold text-gray-900">Contact Info</h3>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2 text-gray-700">
                    <Mail size={16} className="text-gray-400 flex-shrink-0" />
                    <span className="break-all">{order.customerEmail}</span>
                  </div>
                  {order.customerPhone && (
                    <div className="flex items-center gap-2 text-gray-700">
                      <Phone
                        size={16}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span>{order.customerPhone}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Payment Info */}
              <div className="bg-white rounded-xl shadow-sm p-6">
                <div className="flex items-center gap-2 mb-4">
                  <CreditCard className="text-primary" size={20} />
                  <h3 className="font-bold text-gray-900">Payment</h3>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`font-semibold ${
                        order.paymentStatus === 'CAPTURED'
                          ? 'text-green-600'
                          : order.paymentStatus === 'FAILED'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                      }`}
                    >
                      {order.paymentStatus}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Method</span>
                    <span className="font-medium text-gray-900">Card</span>
                  </div>
                </div>
              </div>

              {/* Tracking */}
              {order.trackingNumber && (
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Truck className="text-primary" size={20} />
                    <h3 className="font-bold text-gray-900">Track Package</h3>
                  </div>

                  <p className="text-xs text-gray-500 mb-1">Tracking Number</p>
                  <p className="font-mono text-sm font-semibold text-gray-900 break-all mb-4">
                    {order.trackingNumber}
                  </p>

                  <a
                    href={`https://www.uniuni.com/tracking/?trackingNo=${order.trackingNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-primary text-white rounded-lg hover:bg-primary/90 transition font-semibold text-sm"
                  >
                    <Truck size={15} />
                    Track on UniUni
                  </a>
                </div>
              )}

              {/* Reorder Button */}
              <Link
                href="/products"
                className="block w-full px-6 py-3 bg-primary text-white text-center rounded-lg hover:bg-primary/90 transition font-semibold"
              >
                Shop Again
              </Link>
            </div>
          </div>
        </MaxWidthWrapper>
      </div>
    </>
  );
}
