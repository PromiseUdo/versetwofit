// src/app/checkout/payment/checkout-form.tsx
'use client';

import { useState, useEffect, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js';
import { useCartStore } from '@/store/cart-store';
import { Lock, Loader2, ShieldCheck, CreditCard } from 'lucide-react';
import toast from 'react-hot-toast';

interface CheckoutFormProps {
  orderId: string;
}

export default function CheckoutForm({ orderId }: CheckoutFormProps) {
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
        redirect: 'if_required',
      });

      if (error) {
        // Payment failed
        if (error.type === 'card_error' || error.type === 'validation_error') {
          setMessage(error.message || 'Payment failed');
          toast.error(error.message || 'Payment failed');
        } else {
          setMessage('An unexpected error occurred');
          toast.error('An unexpected error occurred');
        }
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        // Payment succeeded
        toast.success('Payment successful!');
        clearCart();
        router.push(`/order-confirmation?order_id=${orderId}`);
      } else {
        setMessage('Payment processing. Please wait...');
      }
    } catch (err: any) {
      console.error('Payment error:', err);
      setMessage('Payment failed. Please try again.');
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isReady) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-gray-600">Loading payment form...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
            <CreditCard className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Complete Your Payment
            </h1>
            <p className="text-sm text-gray-600">
              Order #{orderId.slice(0, 8).toUpperCase()}
            </p>
          </div>
        </div>

        {/* Security Badges */}
        <div className="flex items-center justify-center gap-6 py-4 border-t border-b bg-gray-50 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <Lock className="w-4 h-4 text-green-600" />
            <span>SSL Encrypted</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span>Secure Checkout</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <CreditCard className="w-4 h-4 text-green-600" />
            <span>PCI Compliant</span>
          </div>
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
                layout: 'tabs',
                defaultValues: {
                  billingDetails: {
                    email: '',
                  },
                },
              }}
            />
          </div>

          {message && (
            <div
              className={`mb-4 p-4 rounded-lg flex items-start gap-3 ${
                message.includes('error') || message.includes('failed')
                  ? 'bg-red-50 border border-red-200 text-red-800'
                  : 'bg-blue-50 border border-blue-200 text-blue-800'
              }`}
            >
              <Lock className="w-5 h-5 flex-shrink-0 mt-0.5" />
              <p className="text-sm">{message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !stripe || !elements}
            className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
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

      {/* Trust Badges */}
      <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200">
        <h3 className="font-semibold text-gray-900 mb-4 text-center">
          Your Security Matters
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
          <div className="text-center">
            <Lock className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p className="font-medium text-gray-900">256-bit SSL</p>
            <p>Bank-level encryption</p>
          </div>
          <div className="text-center">
            <ShieldCheck className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p className="font-medium text-gray-900">PCI Compliant</p>
            <p>Highest security standards</p>
          </div>
          <div className="text-center">
            <CreditCard className="w-8 h-8 mx-auto text-green-600 mb-2" />
            <p className="font-medium text-gray-900">Secure Processing</p>
            <p>Powered by Stripe</p>
          </div>
        </div>
      </div>

      {/* Accepted Cards */}
      <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">We accept</p>
        <div className="flex items-center justify-center gap-3 flex-wrap">
          {['Visa', 'Mastercard', 'American Express', 'Discover'].map(
            (card) => (
              <div
                key={card}
                className="px-4 py-2 bg-white rounded-lg border border-gray-200 text-sm font-medium text-gray-700 shadow-sm"
              >
                {card}
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}
