// src/app/checkout/payment/checkout-form.tsx
"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import {
  PaymentElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useCartStore } from "@/store/cart-store";
import { Lock, Loader2, ShieldCheck, CreditCard } from "lucide-react";
import toast from "react-hot-toast";

interface CheckoutFormProps {
  orderId: string;
  paymentMethod?: "card" | "klarna";
}

export default function CheckoutForm({
  orderId,
  paymentMethod = "card",
}: CheckoutFormProps) {
  const router = useRouter();
  const stripe = useStripe();
  const elements = useElements();
  const clearCart = useCartStore((state) => state.clearCart);

  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    setIsReady(true);
  }, [stripe]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);
    setMessage(null);

    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/order-confirmation?order_id=${orderId}`,
        },
        redirect: "if_required",
      });

      if (error) {
        // Payment failed
        if (error.type === "card_error" || error.type === "validation_error") {
          setMessage(error.message || "Payment failed");
          toast.error(error.message || "Payment failed");
        } else {
          setMessage("An unexpected error occurred");
          toast.error("An unexpected error occurred");
        }
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded
        toast.success("Payment successful!");
        clearCart();
        router.push(`/order-confirmation?order_id=${orderId}`);
      } else {
        setMessage("Payment processing. Please wait...");
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setMessage("Payment failed. Please try again.");
      toast.error("Payment failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 ">
      {/* Header */}
      <div className=" rounded-xl shadow-sm p-6  ">
        <div className="flex items-center gap-3 mb-4">
          {paymentMethod === "klarna" ? (
            <img src="/klarna.png" alt="Klarna" className="h-8 w-auto" />
          ) : (
            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <CreditCard className="w-6 h-6 text-primary" />
            </div>
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {paymentMethod === "klarna"
                ? "Pay in 4 with Klarna"
                : "Complete Your Payment"}
            </h1>
            <p className="text-sm text-gray-600">
              Order #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="px-4 flex items-center justify-center gap-6 py-4 border-t border-b bg-gray-50">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="w-4 h-4 text-primary" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheck className="w-4 h-4 text-primary" />
            <span>Secure Checkout</span>
          </div>
          {paymentMethod === "klarna" ? (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <img
                src="https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg"
                alt=""
                className="h-4 w-auto"
              />
              <span>Pay in 4</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>PCI Compliant</span>
            </div>
          )}
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">
            Payment Information
          </h2>

          <div className="mb-6">
            <PaymentElement
              options={{
                layout: {
                  type: "accordion",
                  defaultCollapsed: false,
                  radios: true,
                  spacedAccordionItems: true,
                },
                defaultValues: {
                  billingDetails: {
                    email: "",
                  },
                },
                // Pre-select Klarna when that method was chosen
                ...(paymentMethod === "klarna" && {
                  paymentMethodOrder: ["klarna"],
                }),
              }}
            />
          </div>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                message.includes("error") || message.includes("failed")
                  ? "bg-red-50 border border-red-200 text-red-800"
                  : "bg-primary/5 border border-primary/20 text-primary"
              }`}
            >
              <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className={`w-full py-4 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${
              paymentMethod === "klarna"
                ? "bg-[#FFB3D1] hover:bg-[#ff9dc2] text-gray-900"
                : "bg-primary text-primary-foreground hover:bg-primary/90"
            }`}
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : paymentMethod === "klarna" ? (
              <>
                <img
                  src="https://x.klarnacdn.net/payment-method/assets/badges/generic/klarna.svg"
                  alt=""
                  className="h-4 w-auto"
                />
                Pay with Klarna
              </>
            ) : (
              <>
                <Lock size={20} />
                Pay Now
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center mt-4">
            Your payment is secured by Stripe. We never store your card details.
          </p>
        </div>
      </form>

      {/* Klarna BNPL Banner */}
      <div className="bg-[#ffd6e7] rounded-xl p-5 flex items-start gap-4 border border-[#ffb3d1]">
        <img
          src="/klarna.png"
          alt="Klarna"
          className="h-7 w-auto shrink-0 mt-0.5"
        />
        <div>
          <p className="font-semibold text-gray-900 text-sm">
            Pay in 4 with Klarna — interest free
          </p>
          <p className="text-xs text-gray-600 mt-0.5">
            Split your purchase into 4 equal payments, every 2 weeks. No
            interest, no fees when you pay on time. Select{" "}
            <strong>Klarna</strong> in the payment options above.
          </p>
        </div>
      </div>

      {/* Trust Badges */}
      <div className="bg-linear-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 text-center">
          Your Security Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <Lock className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-medium text-gray-900">256-bit SSL</p>
            <p>Bank-level encryption</p>
          </div>
          <div className="text-center">
            <ShieldCheck className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-medium text-gray-900">PCI Compliant</p>
            <p>Highest security standards</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-8 h-8 mx-auto text-primary mb-2" />
            <p className="font-medium text-gray-900">Secure Processing</p>
            <p>Powered by Stripe</p>
          </div>
        </div>
      </div>

      {/* Accepted Payments */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">We accept</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {["Visa", "Mastercard"].map((card) => (
            <div
              key={card}
              className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
            >
              {card}
            </div>
          ))}
          {/* Klarna Badge */}
          <div className="px-3 py-1.5 bg-[#ffd6e7] rounded-lg border border-[#ffb3d1] flex items-center gap-2 shadow-sm">
            <img src="/klarna.png" alt="Klarna" className="h-4 w-auto" />
            <span className="text-xs font-semibold text-gray-800">
              Pay in 4
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
