"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import axios from "axios";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { ArrowLeft, Package, CreditCard, Truck } from "lucide-react";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const router = useRouter();

  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    loadOrder();
  }, [id]);

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/admin-order/${id}`);
      setOrder(res.data);
    } catch (e) {
      console.log(e);

      toast.error("Failed to load order");
      router.push("/admin/orders");
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (status: string) => {
    try {
      setUpdating(true);
      await axios.patch(`/api/admin-order/${id}`, { status });
      toast.success("Order status updated");
      loadOrder();
    } catch {
      toast.error("Failed to update order");
    } finally {
      setUpdating(false);
    }
  };

  if (isLoading) {
    return (
      <div className="py-20 text-center text-gray-400">Loading order...</div>
    );
  }

  if (!order) return null;

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-2"
          >
            <ArrowLeft size={16} />
            Back to orders
          </button>

          <h1 className="text-3xl font-bold text-white">
            Order #{order.orderNumber}
          </h1>
          <p className="text-gray-400 mt-1">
            Placed on {format(new Date(order.createdAt), "MMM dd, yyyy")}
          </p>
        </div>

        {/* Status Action */}
        <select
          disabled={updating}
          value={order.status}
          onChange={(e) => updateStatus(e.target.value)}
          className="bg-neutral-800 border text-white border-neutral-700 rounded-lg px-4 py-2"
        >
          <option value="PENDING">Pending</option>
          <option value="PROCESSING">Processing</option>
          <option value="SHIPPED">Shipped</option>
          <option value="DELIVERED">Delivered</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Items */}
        <div className="lg:col-span-2 bg-neutral-800 rounded-xl p-6 border border-neutral-700">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
            <Package size={18} />
            Order Items
          </h2>

          <div className="divide-y divide-neutral-700">
            {order.items.map((item: any) => (
              <div
                key={item.id}
                className="flex items-center justify-between py-4"
              >
                <div className="flex items-center gap-4">
                  {item.image && (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                  )}
                  <div>
                    <p className="font-medium text-white">{item.name}</p>
                    <p className="text-sm text-gray-400">
                      Qty: {item.quantity}
                    </p>
                  </div>
                </div>

                <p className="font-semibold text-white">
                  ${(item.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className="space-y-6">
          {/* Payment */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <CreditCard size={18} />
              Payment
            </h3>

            <p className="text-sm text-gray-400">
              Status:{" "}
              <span className="font-semibold text-white">
                {order.paymentStatus}
              </span>
            </p>

            <p className="text-sm text-gray-400 mt-2">
              Total:{" "}
              <span className="font-semibold text-white">
                ${order.totalAmount.toLocaleString()}
              </span>
            </p>
          </div>

          {/* Customer */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <Truck size={18} />
              Customer
            </h3>

            <p className="text-sm text-white">{order.customerEmail}</p>
            {order.customerPhone && (
              <p className="text-sm text-gray-400 mt-1">
                {order.customerPhone}
              </p>
            )}
          </div>

          {/* Addresses */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="font-semibold text-white mb-3">Shipping Address</h3>
            <pre className="text-sm text-gray-400 whitespace-pre-wrap">
              {JSON.stringify(order.shippingAddress, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
