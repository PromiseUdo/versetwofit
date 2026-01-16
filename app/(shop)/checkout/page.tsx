// src/app/checkout/page.tsx
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { useCartStore } from '@/store/cart-store';
import { useCartValidation } from '@/hooks/use-cart-validation';
import Image from 'next/image';
import Link from 'next/link';
import {
  ChevronLeft,
  Lock,
  Loader2,
  Check,
  CreditCard,
  MapPin,
  Truck,
  AlertCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { loadStripe } from '@stripe/stripe-js';
import axios from 'axios';
import {
  formatCurrency,
  calculateOrderTotal,
  validateUSAddress,
  SHIPPING_METHODS,
  US_STATES,
  ShippingMethod,
} from '@/lib/shipping';

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

type CheckoutStep = 'shipping' | 'payment';

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { validateCart, isValidating } = useCartValidation();

  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);

  // Shipping Information
  const [shippingInfo, setShippingInfo] = useState({
    firstName: '',
    lastName: '',
    email: session?.user?.email || '',
    phone: '',
    street: '',
    apartment: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod>(SHIPPING_METHODS[0]);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getTotalPrice();
  const totals = calculateOrderTotal(
    subtotal,
    selectedShippingMethod.id,
    shippingInfo.state || 'CA'
  );

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      toast.error('Please sign in to checkout');
      router.push('/login?callbackUrl=/checkout');
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && status === 'authenticated') {
      toast.error('Your cart is empty');
      router.push('/cart');
    }
  }, [items.length, status, router]);

  // Validate cart on mount
  useEffect(() => {
    if (items.length > 0 && !validationComplete) {
      handleValidateCart();
    }
  }, [items.length, validationComplete]);

  // Set email from session
  useEffect(() => {
    if (session?.user?.email && !shippingInfo.email) {
      setShippingInfo((prev) => ({
        ...prev,
        email: session.user.email || '',
      }));
    }
  }, [session]);

  const handleValidateCart = async () => {
    const result = await validateCart();

    if (!result) {
      toast.error('Failed to validate cart');
      return;
    }

    if (result.hasInvalidItems) {
      toast.error('Some items are no longer available. Redirecting to cart...');
      setTimeout(() => router.push('/cart'), 2000);
      return;
    }

    setValidationComplete(true);
  };

  const validateShippingForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!shippingInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (
      !shippingInfo.email.trim() ||
      !/\S+@\S+\.\S+/.test(shippingInfo.email)
    ) {
      newErrors.email = 'Valid email is required';
    }
    if (
      !shippingInfo.phone.trim() ||
      !/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ''))
    ) {
      newErrors.phone = 'Valid 10-digit phone number is required';
    }

    const addressValidation = validateUSAddress({
      street: shippingInfo.street,
      city: shippingInfo.city,
      state: shippingInfo.state,
      zipCode: shippingInfo.zipCode,
    });

    if (!addressValidation.isValid) {
      addressValidation.errors.forEach((error) => {
        if (error.includes('Street')) newErrors.street = error;
        if (error.includes('City')) newErrors.city = error;
        if (error.includes('state')) newErrors.state = error;
        if (error.includes('ZIP')) newErrors.zipCode = error;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleProceedToPayment = () => {
    if (!validateShippingForm()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setCurrentStep('payment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCreatePaymentIntent = async () => {
    if (!validateShippingForm()) {
      toast.error('Please verify your shipping information');
      setCurrentStep('shipping');
      return;
    }

    setIsProcessing(true);

    try {
      // Final cart validation
      const validationResult = await validateCart();
      if (!validationResult || validationResult.hasInvalidItems) {
        toast.error('Cart validation failed. Please review your cart.');
        router.push('/cart');
        return;
      }

      // Create payment intent
      const response = await axios.post('/api/checkout/create-payment-intent', {
        items: items.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
          price: item.price,
        })),
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.street,
          apartment: shippingInfo.apartment,
          city: shippingInfo.city,
          state: shippingInfo.state,
          zipCode: shippingInfo.zipCode,
        },
        billingAddress: billingSameAsShipping
          ? {
              firstName: shippingInfo.firstName,
              lastName: shippingInfo.lastName,
              street: shippingInfo.street,
              apartment: shippingInfo.apartment,
              city: shippingInfo.city,
              state: shippingInfo.state,
              zipCode: shippingInfo.zipCode,
            }
          : null,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        shippingMethodId: selectedShippingMethod.id,
        totals: totals,
      });

      const { clientSecret, orderId } = response.data;

      // Redirect to Stripe Checkout
      const stripe = await stripePromise;
      if (!stripe) {
        throw new Error('Stripe failed to load');
      }

      // Store order ID for confirmation page
      sessionStorage.setItem('pendingOrderId', orderId);

      // Redirect to payment page with client secret
      router.push(
        `/checkout/payment?client_secret=${clientSecret}&order_id=${orderId}`
      );
    } catch (error: any) {
      console.error('Payment intent creation error:', error);
      toast.error(
        error.response?.data?.error || 'Failed to initialize payment'
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === 'loading' || isValidating || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-indigo-600 mb-4" />
          <p className="text-gray-600">
            {isValidating ? 'Validating cart...' : 'Loading checkout...'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ChevronLeft size={20} />
            Back to Cart
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
        </div>

        {/* Progress Steps */}
        <div className="mb-8 flex items-center justify-center">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'shipping'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-green-500 text-white'
                }`}
              >
                {currentStep === 'payment' ? <Check size={20} /> : '1'}
              </div>
              <span className="font-medium text-gray-900">
                Shipping Information
              </span>
            </div>

            <div className="w-16 h-0.5 bg-gray-300" />

            <div className="flex items-center gap-2">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center ${
                  currentStep === 'payment'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-300 text-gray-600'
                }`}
              >
                2
              </div>
              <span
                className={`font-medium ${
                  currentStep === 'payment' ? 'text-gray-900' : 'text-gray-500'
                }`}
              >
                Payment
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Shipping Information Form */}
            {currentStep === 'shipping' && (
              <>
                {/* Contact Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <MapPin className="text-indigo-600" size={24} />
                    <h2 className="text-xl font-bold text-gray-900">
                      Contact Information
                    </h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        First Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.firstName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            firstName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border ${
                          errors.firstName
                            ? 'border-red-500'
                            : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="John"
                      />
                      {errors.firstName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.firstName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Last Name *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.lastName}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            lastName: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border ${
                          errors.lastName ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="Doe"
                      />
                      {errors.lastName && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.lastName}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        value={shippingInfo.email}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            email: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border ${
                          errors.email ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="john.doe@example.com"
                      />
                      {errors.email && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        value={shippingInfo.phone}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            phone: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border ${
                          errors.phone ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="(555) 123-4567"
                      />
                      {errors.phone && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.phone}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-6">
                    Shipping Address
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.street}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            street: e.target.value,
                          })
                        }
                        className={`w-full px-4 py-3 border ${
                          errors.street ? 'border-red-500' : 'border-gray-300'
                        } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        placeholder="123 Main Street"
                      />
                      {errors.street && (
                        <p className="text-sm text-red-600 mt-1">
                          {errors.street}
                        </p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Apartment, suite, etc. (Optional)
                      </label>
                      <input
                        type="text"
                        value={shippingInfo.apartment}
                        onChange={(e) =>
                          setShippingInfo({
                            ...shippingInfo,
                            apartment: e.target.value,
                          })
                        }
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                        placeholder="Apt 4B"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          City *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.city}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              city: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border ${
                            errors.city ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          placeholder="New York"
                        />
                        {errors.city && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.city}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          State *
                        </label>
                        <select
                          value={shippingInfo.state}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              state: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border ${
                            errors.state ? 'border-red-500' : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                        >
                          <option value="">Select State</option>
                          {Object.entries(US_STATES).map(([code, name]) => (
                            <option key={code} value={code}>
                              {name}
                            </option>
                          ))}
                        </select>
                        {errors.state && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.state}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          ZIP Code *
                        </label>
                        <input
                          type="text"
                          value={shippingInfo.zipCode}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              zipCode: e.target.value,
                            })
                          }
                          className={`w-full px-4 py-3 border ${
                            errors.zipCode
                              ? 'border-red-500'
                              : 'border-gray-300'
                          } rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent`}
                          placeholder="10001"
                        />
                        {errors.zipCode && (
                          <p className="text-sm text-red-600 mt-1">
                            {errors.zipCode}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Methods */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <Truck className="text-indigo-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">
                      Shipping Method
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {SHIPPING_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                          selectedShippingMethod.id === method.id
                            ? 'border-indigo-600 bg-indigo-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="radio"
                            name="shipping"
                            checked={selectedShippingMethod.id === method.id}
                            onChange={() => setSelectedShippingMethod(method)}
                            className="w-5 h-5 text-indigo-600"
                          />
                          <div>
                            <p className="font-semibold text-gray-900">
                              {method.name}
                            </p>
                            <p className="text-sm text-gray-600">
                              {method.description}
                            </p>
                            {method.carrier && (
                              <p className="text-xs text-gray-500 mt-1">
                                via {method.carrier}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="font-bold text-gray-900">
                          {totals.shipping === 0
                            ? 'FREE'
                            : formatCurrency(method.price)}
                        </p>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Continue Button */}
                <button
                  onClick={handleProceedToPayment}
                  className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                >
                  Continue to Payment
                </button>
              </>
            )}

            {/* Payment Step */}
            {currentStep === 'payment' && (
              <>
                {/* Review Information */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-bold text-gray-900">
                      Review Your Information
                    </h3>
                    <button
                      onClick={() => setCurrentStep('shipping')}
                      className="text-indigo-600 hover:text-indigo-700 text-sm font-medium"
                    >
                      Edit
                    </button>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">
                        {shippingInfo.firstName} {shippingInfo.lastName}
                      </p>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.email}
                      </p>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.phone}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Shipping Address</p>
                      <p className="font-medium text-gray-900">
                        {shippingInfo.street}
                        {shippingInfo.apartment &&
                          `, ${shippingInfo.apartment}`}
                      </p>
                      <p className="text-sm text-gray-600">
                        {shippingInfo.city}, {shippingInfo.state}{' '}
                        {shippingInfo.zipCode}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-600">Shipping Method</p>
                      <p className="font-medium text-gray-900">
                        {selectedShippingMethod.name} -{' '}
                        {selectedShippingMethod.estimatedDays}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Payment Section */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center gap-2 mb-6">
                    <CreditCard className="text-indigo-600" size={24} />
                    <h3 className="text-lg font-bold text-gray-900">Payment</h3>
                  </div>

                  <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-6 mb-6 border border-indigo-100">
                    <div className="flex items-start gap-3">
                      <Lock className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="font-semibold text-gray-900 mb-1">
                          Secure Payment with Stripe
                        </p>
                        <p className="text-sm text-gray-600">
                          Your payment information is encrypted and secure. We
                          never store your card details.
                        </p>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCreatePaymentIntent}
                    disabled={isProcessing}
                    className="w-full bg-indigo-600 text-white py-4 rounded-lg font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Lock size={20} />
                        Proceed to Secure Payment
                      </>
                    )}
                  </button>

                  <p className="text-xs text-gray-500 text-center mt-4">
                    By placing your order, you agree to our Terms of Service and
                    Privacy Policy
                  </p>
                </div>
              </>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Order Summary
              </h3>

              {/* Cart Items */}
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    {/* <div className="relative w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute z-50 -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {item.quantity}
                      </div>
                    </div> */}

                    <div className="relative w-16 h-16 mt-2 bg-gray-100 rounded-lg flex-shrink-0">
                      {/* No overflow-hidden here anymore */}
                      <Image
                        src={item.image}
                        alt={item.productName}
                        fill
                        className="object-cover rounded-lg" // ← move rounded corners here
                      />
                      <div className="absolute z-50 -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                        {item.quantity}
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 line-clamp-2">
                        {item.productName}
                      </p>
                      {(item.color || item.size) && (
                        <p className="text-xs text-gray-600">
                          {[item.color, item.size].filter(Boolean).join(' • ')}
                        </p>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-gray-900">
                      {formatCurrency(item.price * item.quantity)}
                    </p>
                  </div>
                ))}
              </div>

              {/* Totals */}
              <div className="space-y-3 pt-6 border-t">
                <div className="flex justify-between text-gray-700">
                  <span>Subtotal</span>
                  <span className="font-semibold">
                    {formatCurrency(totals.subtotal)}
                  </span>
                </div>

                <div className="flex justify-between text-gray-700">
                  <span>Shipping</span>
                  <span className="font-semibold">
                    {totals.shipping === 0
                      ? 'FREE'
                      : formatCurrency(totals.shipping)}
                  </span>
                </div>

                {shippingInfo.state && (
                  <div className="flex justify-between text-gray-700">
                    <span>Tax ({shippingInfo.state})</span>
                    <span className="font-semibold">
                      {formatCurrency(totals.tax)}
                    </span>
                  </div>
                )}

                <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span>{formatCurrency(totals.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
