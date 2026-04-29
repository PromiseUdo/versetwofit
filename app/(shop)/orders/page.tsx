// src/app/orders/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Image from 'next/image';
import Link from 'next/link';
import {
  Package,
  Loader2,
  ShoppingBag,
  ChevronRight,
  Filter,
  Calendar,
  Truck,
  CheckCircle,
  XCircle,
  Clock,
  Box,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { formatCurrency } from '@/lib/shipping';
import MaxWidthWrapper from '@/components/max-width-wrapper';
import { cn } from '@/lib/utils';

interface OrderItem {
  id: string;
  name: string;
  image: string | null;
  quantity: number;
  price: number;
  productSlug: string;
}

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  paymentStatus: string;
  totalAmount: number;
  itemCount: number;
  createdAt: string;
  items: OrderItem[];
}

const STATUS_CONFIG = {
  PENDING: {
    label: 'Pending',
    color: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    icon: Clock,
  },
  PROCESSING: {
    label: 'Processing',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
    icon: Box,
  },
  SHIPPED: {
    label: 'Shipped',
    color: 'bg-purple-50 text-purple-700 border-purple-200',
    icon: Truck,
  },
  DELIVERED: {
    label: 'Delivered',
    color: 'bg-green-50 text-green-700 border-green-200',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelled',
    color: 'bg-red-50 text-red-700 border-red-200',
    icon: XCircle,
  },
};

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login?callbackUrl=/orders');
    }
  }, [status, router]);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchOrders();
    }
  }, [status, selectedStatus, currentPage]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/customer-orders', {
        params: {
          page: currentPage,
          limit: 10,
          status: selectedStatus,
        },
      });

      setOrders(response.data.orders);

      // console.log(response.data.orders, 'orders');
      setTotalPages(response.data.pagination.totalPages);
    } catch (error: any) {
      console.error('Failed to fetch orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    return (
      STATUS_CONFIG[status as keyof typeof STATUS_CONFIG] ||
      STATUS_CONFIG.PENDING
    );
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (status === 'loading' || (loading && orders.length === 0)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto text-primary mb-4" />
          <p className="text-sm text-gray-500">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />

      <div className="min-h-screen my-24">
        <MaxWidthWrapper>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Your Orders</h1>
              <p className="text-sm text-gray-500">
                Manage your purchase history
              </p>
            </div>

            {/* Compact Filters */}
            <div className="flex overflow-x-auto pb-2 scrollbar-hide -mx-4 px-4 md:mx-0 md:px-0">
              <div className="flex bg-gray-100 p-1 rounded-lg">
                {[
                  { value: 'all', label: 'All' },
                  {
                    value: 'active',
                    label: 'Active',
                    statusGroup: ['pending', 'processing', 'shipped'],
                  },
                  { value: 'delivered', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ].map((filter) => {
                  // Simplified filter logic for display purposes, mapping back to API status
                  // in a real app you might want to adjust the API to handle groups or keep simple status
                  // For now, sticking to simple status mapping or 'all'
                  // Let's stick to the granular statuses but present them cleaner if needed.
                  // Actually, let's keep the user's specific status request from the plan but simplify visuals.
                  return null;
                })}
                {[
                  { value: 'all', label: 'All' },
                  { value: 'pending', label: 'Pending' },
                  { value: 'processing', label: 'Processing' },
                  { value: 'shipped', label: 'Shipped' },
                  { value: 'delivered', label: 'Delivered' },
                ].map((filter) => (
                  <button
                    key={filter.value}
                    onClick={() => {
                      setSelectedStatus(filter.value);
                      setCurrentPage(1);
                    }}
                    className={cn(
                      'px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap',
                      selectedStatus === filter.value
                        ? 'bg-white text-gray-900 shadow-sm'
                        : 'text-gray-500 hover:text-gray-900',
                    )}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Orders List */}
          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-24 bg-gray-50 rounded-lg animate-pulse"
                />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-200">
              <ShoppingBag className="w-8 h-8 mx-auto text-gray-300 mb-3" />
              <p className="text-gray-900 font-medium mb-1">No orders found</p>
              <p className="text-xs text-gray-500 mb-4">
                You haven't placed any orders with this status.
              </p>
              <Link
                href="/products"
                className="inline-flex items-center text-sm font-medium text-primary hover:underline"
              >
                Start Shopping <ArrowRight size={14} className="ml-1" />
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const StatusIcon = statusConfig.icon;

                return (
                  <Link
                    key={order.id}
                    href={`/orders/${order.id}`}
                    className="group block bg-white border border-gray-100 rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all duration-200"
                  >
                    <div className="flex flex-col sm:flex-row gap-4 sm:items-center justify-between">
                      {/* Left: Essential Info */}
                      <div className="flex-shrink-0 min-w-[140px]">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-sm font-semibold text-gray-900">
                            #{order.orderNumber}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-2">
                          <Calendar size={12} />
                          {formatDate(order.createdAt)}
                        </div>
                        <span
                          className={cn(
                            'inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[10px] font-medium border',
                            statusConfig.color,
                          )}
                        >
                          <StatusIcon size={10} />
                          {statusConfig.label}
                        </span>
                      </div>

                      {/* Middle: Product Thumbnails */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          {order.items.slice(0, 4).map((item) => (
                            <div
                              key={item.id}
                              className="relative w-10 h-10 bg-gray-50 rounded border border-gray-100 overflow-hidden flex-shrink-0"
                            >
                              {item.image ? (
                                <Image
                                  src={item.image}
                                  alt={item.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <Package
                                    size={14}
                                    className="text-gray-300"
                                  />
                                </div>
                              )}
                            </div>
                          ))}
                          {order.items.length > 4 && (
                            <div className="w-10 h-10 rounded border border-gray-100 bg-gray-50 flex items-center justify-center text-xs font-medium text-gray-500">
                              +{order.items.length - 4}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-gray-500 mt-1.5 truncate">
                          {order.items.map((i) => i.name).join(', ')}
                        </p>
                      </div>

                      {/* Right: Total & Action */}
                      <div className="flex items-center justify-between sm:justify-end gap-6 sm:min-w-[120px]">
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="text-sm font-bold text-gray-900">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                        <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                          <ChevronRight size={16} />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-2">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.max(1, prev - 1));
                }}
                disabled={currentPage === 1}
                className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} className="rotate-180" />
              </button>
              <span className="text-xs font-medium text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <button
                onClick={(e) => {
                  e.preventDefault();
                  setCurrentPage((prev) => Math.min(totalPages, prev + 1));
                }}
                disabled={currentPage === totalPages}
                className="p-2 bg-white border border-gray-200 rounded-md text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </MaxWidthWrapper>
      </div>
    </>
  );
}
