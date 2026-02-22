"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import {
  DollarSign,
  ShoppingBag,
  Users,
  Package,
  TrendingUp,
  CreditCard,
  Truck,
  ArrowRight,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import Link from "next/link";
import toast from "react-hot-toast";

// Types
type DashboardData = {
  metrics: {
    totalRevenue: number;
    totalOrders: number;
    activeProducts: number;
    totalCustomers: number;
  };
  recentOrders: any[];
  revenueTrend: any[];
  orderStatus: any[];
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#f59e0b", // amber-500
  PROCESSING: "#3b82f6", // blue-500
  SHIPPED: "#8b5cf6", // violet-500
  DELIVERED: "#10b981", // emerald-500
  CANCELLED: "#ef4444", // red-500
};

export default function AdminDashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await axios.get("/api/admin/dashboard");
        setData(res.data);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
        toast.error("Failed to load dashboard data");
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="py-20 text-center text-gray-400">
        Failed to load dashboard.
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight">
          Overview
        </h1>
        <p className="text-gray-400 mt-1">
          Here's what's happening with your store today.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Revenue"
          value={`$${data.metrics.totalRevenue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
          icon={<DollarSign size={20} className="text-emerald-500" />}
          gradient="from-emerald-500/10 to-transparent"
        />
        <StatCard
          title="Total Orders"
          value={data.metrics.totalOrders.toLocaleString()}
          icon={<ShoppingBag size={20} className="text-blue-500" />}
          gradient="from-blue-500/10 to-transparent"
        />
        <StatCard
          title="Active Customers"
          value={data.metrics.totalCustomers.toLocaleString()}
          icon={<Users size={20} className="text-violet-500" />}
          gradient="from-violet-500/10 to-transparent"
        />
        <StatCard
          title="Active Products"
          value={data.metrics.activeProducts.toLocaleString()}
          icon={<Package size={20} className="text-amber-500" />}
          gradient="from-amber-500/10 to-transparent"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Revenue Trend Area Chart */}
        <div className="lg:col-span-2 bg-neutral-800 rounded-xl p-6 border border-neutral-700/50 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
            <TrendingUp size={120} />
          </div>
          <h2 className="text-lg font-semibold text-white mb-6">
            Revenue Trend (Last 7 Days)
          </h2>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={data.revenueTrend}
                margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#374151"
                  vertical={false}
                />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#9ca3af"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `$${value}`}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1f2937",
                    borderColor: "#374151",
                    borderRadius: "0.5rem",
                    color: "#fff",
                  }}
                  itemStyle={{ color: "#10b981", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#10b981"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#colorRevenue)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order Status Donut Chart */}
        <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700/50">
          <h2 className="text-lg font-semibold text-white mb-6">
            Orders by Status
          </h2>
          <div className="h-[240px] w-full flex items-center justify-center">
            {data.orderStatus.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.orderStatus}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {data.orderStatus.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={STATUS_COLORS[entry.name] || "#6b7280"}
                        stroke="rgba(0,0,0,0)"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#1f2937",
                      borderColor: "#374151",
                      borderRadius: "0.5rem",
                      color: "#fff",
                    }}
                    itemStyle={{ color: "#fff" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="text-gray-500 text-sm">No orders yet</div>
            )}
          </div>
          {/* Custom Legend */}
          <div className="mt-4 grid grid-cols-2 gap-2">
            {data.orderStatus.map((status) => (
              <div
                key={status.name}
                className="flex items-center gap-2 text-sm text-gray-400"
              >
                <div
                  className="w-3 h-3 rounded-full"
                  style={{
                    backgroundColor: STATUS_COLORS[status.name] || "#6b7280",
                  }}
                ></div>
                <span className="capitalize">{status.name.toLowerCase()}</span>
                <span className="text-white ml-auto">{status.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700/50 overflow-hidden">
        <div className="p-6 border-b border-neutral-700/50 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Recent Orders</h2>
          <Link
            href="/admin/orders"
            className="text-sm text-emerald-500 hover:text-emerald-400 flex items-center gap-1 transition-colors"
          >
            View All <ArrowRight size={16} />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-400 mb-2">
            <thead className="text-xs uppercase bg-neutral-900/50 text-gray-500">
              <tr>
                <th className="px-6 py-4 font-medium">Order#</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Date</th>
                <th className="px-6 py-4 font-medium">Total</th>
                <th className="px-6 py-4 font-medium">Payment</th>
                <th className="px-6 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-700/50">
              {data.recentOrders.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-gray-500"
                  >
                    No recent orders found.
                  </td>
                </tr>
              ) : (
                data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-neutral-700/20 transition-colors group"
                  >
                    <td className="px-6 py-4 font-medium text-white group-hover:text-emerald-400 transition-colors whitespace-nowrap">
                      <Link href={`/admin/orders/${order.id}`}>
                        {order.orderNumber}
                      </Link>
                    </td>
                    <td className="px-6 py-4">
                      {order.shippingFirstName ||
                        order.user?.name ||
                        "Customer"}{" "}
                      {order.shippingLastName || ""}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {format(new Date(order.createdAt), "MMM dd, yyyy")}
                    </td>
                    <td className="px-6 py-4 text-white font-medium">
                      ${order.totalAmount?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-semibold rounded-full uppercase tracking-wider ${
                          order.paymentStatus === "PAID" ||
                          order.paymentStatus === "CAPTURED"
                            ? "bg-emerald-500/10 text-emerald-500 border border-emerald-500/20"
                            : order.paymentStatus === "FAILED"
                              ? "bg-red-500/10 text-red-500 border border-red-500/20"
                              : "bg-amber-500/10 text-amber-500 border border-amber-500/20"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor:
                              STATUS_COLORS[order.status] || "#6b7280",
                          }}
                        ></div>
                        <span className="capitalize">
                          {order.status.toLowerCase()}
                        </span>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Helper Component
function StatCard({
  title,
  value,
  icon,
  gradient,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}) {
  return (
    <div
      className={`bg-neutral-800 rounded-xl p-6 border border-neutral-700/50 relative overflow-hidden group hover:border-neutral-600 transition-colors`}
    >
      <div
        className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-50 group-hover:opacity-100 transition-opacity`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-400 tracking-wide uppercase">
            {title}
          </p>
          <p className="text-3xl font-bold text-white mt-2 tracking-tight">
            {value}
          </p>
        </div>
        <div className="p-3 bg-neutral-900/50 rounded-lg border border-neutral-700/50 shadow-inner">
          {icon}
        </div>
      </div>
    </div>
  );
}
