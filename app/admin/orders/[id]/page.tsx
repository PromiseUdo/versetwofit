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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white mb-4"
          >
            <ArrowLeft size={16} />
            Back to orders
          </button>

          <div className="flex flex-wrap items-center gap-4">
            <h1 className="text-3xl font-bold text-white">
              Order #{order.orderNumber}
            </h1>
            <span
              className={`px-3 py-1 text-xs font-semibold rounded-full ${
                order.paymentStatus === "PAID" ||
                order.paymentStatus === "CAPTURED"
                  ? "bg-green-500/10 text-green-500"
                  : order.paymentStatus === "FAILED"
                    ? "bg-red-500/10 text-red-500"
                    : "bg-yellow-500/10 text-yellow-500"
              }`}
            >
              Payment: {order.paymentStatus}
            </span>
          </div>
          <p className="text-gray-400 mt-2">
            Placed on{" "}
            {format(new Date(order.createdAt), "MMM dd, yyyy 'at' hh:mm a")}
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
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
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
                  <div className="flex gap-4">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 rounded-lg object-cover bg-neutral-900"
                      />
                    )}
                    <div>
                      <p className="font-medium text-white">{item.name}</p>
                      {(item.color || item.size) && (
                        <p className="text-sm text-gray-400 mt-0.5">
                          {item.color} {item.color && item.size ? "/" : ""}{" "}
                          {item.size}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        ${item.price?.toLocaleString()} × {item.quantity}
                      </p>
                    </div>
                  </div>

                  <p className="font-semibold text-white">
                    ${(item.price * item.quantity).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>

            {/* Notes */}
            {order.notes && (
              <div className="mt-6 pt-6 border-t border-neutral-700">
                <h3 className="text-sm font-semibold text-white mb-2">
                  Order Notes
                </h3>
                <div className="bg-neutral-900/50 p-4 rounded-lg text-sm text-gray-300 whitespace-pre-wrap">
                  {order.notes}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Details */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="font-semibold mb-4 text-white flex items-center gap-2">
              <CreditCard size={18} />
              Payment Summary
            </h3>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between text-gray-400">
                <span>Subtotal</span>
                <span className="text-white">
                  ${order.subtotal?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>
                  Shipping{" "}
                  {order.shippingMethod ? `(${order.shippingMethod})` : ""}
                </span>
                <span className="text-white">
                  ${order.shippingCost?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="flex justify-between text-gray-400">
                <span>Tax</span>
                <span className="text-white">
                  ${order.tax?.toLocaleString() ?? 0}
                </span>
              </div>
              <div className="pt-3 border-t border-neutral-700 flex justify-between font-semibold text-base">
                <span className="text-white">Total</span>
                <span className="text-white">
                  ${(order.total || order.totalAmount)?.toLocaleString() ?? 0}
                </span>
              </div>
            </div>

            {(order.stripePaymentId || order.klarnaOrderId) && (
              <div className="mt-4 pt-4 border-t border-neutral-700 space-y-2 text-xs">
                {order.stripePaymentId && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 whitespace-nowrap">
                      Stripe ID
                    </span>
                    <span className="text-gray-400 font-mono break-all text-right">
                      {order.stripePaymentId}
                    </span>
                  </div>
                )}
                {order.klarnaOrderId && (
                  <div className="flex justify-between gap-4">
                    <span className="text-gray-500 whitespace-nowrap">
                      Klarna ID
                    </span>
                    <span className="text-gray-400 font-mono break-all text-right">
                      {order.klarnaOrderId}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Customer */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="font-semibold mb-3 text-white flex items-center gap-2">
              <Truck size={18} />
              Customer Details
            </h3>

            <p className="text-sm font-medium text-white">
              {order.shippingFirstName ||
                order.billingFirstName ||
                order.user?.name ||
                "Customer"}{" "}
              {order.shippingLastName || order.billingLastName || ""}
            </p>
            <p className="text-sm text-gray-400 mt-1 break-all">
              {order.customerEmail || order.email || order.user?.email}
            </p>
            {(order.customerPhone || order.phone) && (
              <p className="text-sm text-gray-400 mt-1">
                {order.customerPhone || order.phone}
              </p>
            )}
          </div>

          {/* Shipping Address */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="font-semibold text-white mb-3">Shipping Info</h3>

            {order.shippingStreet ? (
              <div className="text-sm text-gray-400 leading-relaxed">
                <p className="text-white mb-1">
                  {order.shippingFirstName} {order.shippingLastName}
                </p>
                <p>
                  {order.shippingStreet}{" "}
                  {order.shippingApartment
                    ? `Apt ${order.shippingApartment}`
                    : ""}
                </p>
                <p>
                  {order.shippingCity}, {order.shippingProvince}{" "}
                  {order.shippingPostalCode}
                </p>
                <p>{order.shippingCountry}</p>
              </div>
            ) : order.shippingAddress ? (
              <pre className="text-sm text-gray-400 whitespace-pre-wrap font-sans">
                {typeof order.shippingAddress === "string"
                  ? order.shippingAddress
                  : JSON.stringify(order.shippingAddress, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-gray-500 italic">
                No shipping address provided
              </p>
            )}

            {(order.uniUniOrderNumber || order.trackingNumber) && (
              <div className="mt-4 pt-4 border-t border-neutral-700 space-y-3 text-xs">
                {order.uniUniOrderNumber && (
                  <div className="flex flex-col gap-1">
                    <span className="text-gray-500">UniUni Order #</span>
                    <span className="text-white font-mono break-all">
                      {order.uniUniOrderNumber}
                    </span>
                  </div>
                )}
                {order.trackingNumber && (
                  <div className="flex flex-col gap-1.5">
                    <span className="text-gray-500">Tracking Number</span>
                    <span className="text-white font-mono break-all">
                      {order.trackingNumber}
                    </span>
                    <a
                      href={`https://www.uniuni.com/tracking/?trackingNo=${order.trackingNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1 flex items-center justify-center gap-1.5 w-full px-3 py-2 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg transition text-xs font-medium"
                    >
                      <Truck size={13} />
                      Track Shipment on UniUni
                    </a>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Billing Address */}
          <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
            <h3 className="font-semibold text-white mb-3">Billing Address</h3>
            {order.billingStreet ? (
              <div className="text-sm text-gray-400 leading-relaxed">
                <p className="text-white mb-1">
                  {order.billingFirstName} {order.billingLastName}
                </p>
                <p>
                  {order.billingStreet}{" "}
                  {order.billingApartment
                    ? `Apt ${order.billingApartment}`
                    : ""}
                </p>
                <p>
                  {order.billingCity}, {order.billingProvince}{" "}
                  {order.billingPostalCode}
                </p>
                <p>{order.billingCountry}</p>
              </div>
            ) : order.billingAddress ? (
              <pre className="text-sm text-gray-400 whitespace-pre-wrap font-sans">
                {typeof order.billingAddress === "string"
                  ? order.billingAddress
                  : JSON.stringify(order.billingAddress, null, 2)}
              </pre>
            ) : (
              <p className="text-sm text-gray-500 italic">
                Same as shipping or not provided
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
