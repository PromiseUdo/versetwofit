'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { format } from 'date-fns';
import {
  Search,
  Filter,
  Loader2,
  ChevronLeft,
  ChevronRight,
  Package,
  CreditCard,
  Truck,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { Input } from '@/components/ui/input';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    loadOrders();
  }, [page, search, statusFilter]);

  const loadOrders = async () => {
    try {
      setIsLoading(true);

      const params = new URLSearchParams({
        page: page.toString(),
        limit: '20',
        ...(search && { search }),
        ...(statusFilter && { status: statusFilter }),
      });

      const res = await axios.get(`/api/orders?${params}`);
      setOrders(res.data.orders);
      setTotalPages(res.data.pagination.totalPages);
      setTotal(res.data.pagination.total);
    } catch {
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const base = 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold';

    switch (status) {
      case 'DELIVERED':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'SHIPPED':
        return `${base} bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300`;
      case 'PROCESSING':
        return `${base} bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300`;
      case 'CANCELLED':
        return `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`;
    }
  };

  const getPaymentBadge = (status: string) => {
    const base = 'inline-flex px-2.5 py-0.5 rounded-full text-xs font-semibold';

    switch (status) {
      case 'CAPTURED':
        return `${base} bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300`;
      case 'FAILED':
        return `${base} bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300`;
      case 'REFUNDED':
        return `${base} bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300`;
      default:
        return `${base} bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300`;
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Orders
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">
          View and manage customer orders
        </p>
      </div>

      {/* Filters */}
      <div className="bg-neutral-800 rounded-xl p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
          {/* Search */}
          <div className="relative">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <Input
              placeholder="Search order number or email..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="pl-10 bg-neutral-800 border-none focus:ring-0"
            />
          </div>

          {/* Status */}
          <div className="relative">
            <Filter
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 py-2 rounded-lg bg-neutral-700 text-white border-none focus:ring-0"
            >
              <option value="">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="PROCESSING">Processing</option>
              <option value="SHIPPED">Shipped</option>
              <option value="DELIVERED">Delivered</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          {/* Count */}
          <div className="flex justify-end text-sm text-gray-400">
            <Package size={16} className="mr-2" />
            {total} orders
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-neutral-800 rounded-xl overflow-hidden border border-neutral-700">
        {isLoading ? (
          <div className="py-20 flex justify-center">
            <Loader2 className="animate-spin" />
          </div>
        ) : orders.length === 0 ? (
          <div className="py-20 text-center text-gray-400">No orders found</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-neutral-900 border-b border-neutral-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                      Order
                    </th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                      Customer
                    </th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                      Total
                    </th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                      Payment
                    </th>
                    <th className="px-6 py-3 text-left text-xs uppercase text-gray-500">
                      Date
                    </th>
                    <th className="px-6 py-3 text-right text-xs uppercase text-gray-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-neutral-700">
                  {orders.map((order) => (
                    <tr
                      key={order.id}
                      className="hover:bg-neutral-700 transition"
                    >
                      <td className="px-6 py-4 font-medium text-white">
                        #{order.orderNumber}
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <p className="text-white">{order.customerEmail}</p>
                          {order.customerPhone && (
                            <p className="text-gray-400 text-xs">
                              {order.customerPhone}
                            </p>
                          )}
                        </div>
                      </td>

                      <td className="px-6 py-4 text-white font-semibold">
                        ${order.totalAmount.toLocaleString()}
                      </td>

                      <td className="px-6 py-4">
                        <span className={getStatusBadge(order.status)}>
                          {order.status}
                        </span>
                      </td>

                      <td className="px-6 py-4">
                        <span className={getPaymentBadge(order.paymentStatus)}>
                          {order.paymentStatus}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-white">
                        {format(new Date(order.createdAt), 'MMM dd, yyyy')}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Link
                          href={`/admin/orders/${order.id}`}
                          className="inline-flex items-center gap-1 text-indigo-400 hover:text-indigo-300"
                        >
                          <Truck size={16} />
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-between items-center px-6 py-4 border-t border-neutral-700">
                <span className="text-sm text-gray-400">
                  Page {page} of {totalPages}
                </span>
                <div className="flex gap-2">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage(page - 1)}
                    className="p-2 rounded-lg border border-neutral-700 disabled:opacity-50"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    disabled={page === totalPages}
                    onClick={() => setPage(page + 1)}
                    className="p-2 rounded-lg border border-neutral-700 disabled:opacity-50"
                  >
                    <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
