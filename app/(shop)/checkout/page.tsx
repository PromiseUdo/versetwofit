// src/app/checkout/page.tsx (UPDATED FOR CANADA)
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useCartStore } from "@/store/cart-store";
import { useCartValidation } from "@/hooks/use-cart-validation";
import Image from "next/image";
import Link from "next/link";
import {
  ChevronLeft,
  Lock,
  Loader2,
  Check,
  CreditCard,
  MapPin,
  Truck,
  AlertCircle,
  Info,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import {
  formatCurrency,
  calculateOrderTotal,
  calculateOrderTotalWithDynamicRate,
  validateCanadianAddress,
  SHIPPING_METHODS,
  CANADIAN_PROVINCES,
  formatPostalCode,
  type ShippingMethod,
  type DynamicShippingRate,
} from "@/lib/shipping";
import MaxWidthWrapper from "@/components/max-width-wrapper";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!,
);

type CheckoutStep = "shipping" | "payment";

export default function CheckoutPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { validateCart, isValidating } = useCartValidation();

  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const clearCart = useCartStore((state) => state.clearCart);

  const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
  const [isProcessing, setIsProcessing] = useState(false);
  const [validationComplete, setValidationComplete] = useState(false);
  const [loadingRates, setLoadingRates] = useState(false);

  // Shipping Information (CANADIAN FORMAT)
  const [shippingInfo, setShippingInfo] = useState({
    firstName: "",
    lastName: "",
    email: session?.user?.email || "",
    phone: "",
    street: "",
    apartment: "",
    city: "",
    province: "", // Changed from 'state'
    postalCode: "", // Canadian postal code format
  });

  const [selectedShippingMethod, setSelectedShippingMethod] =
    useState<ShippingMethod>(SHIPPING_METHODS[0]);

  // Shipping rate fetched from UniUni (only after "Continue to Payment")
  const [fetchedShippingRate, setFetchedShippingRate] =
    useState<DynamicShippingRate | null>(null);

  const [billingSameAsShipping, setBillingSameAsShipping] = useState(true);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const subtotal = getTotalPrice();

  // Calculate totals - only include actual shipping on payment step when we have fetched rate
  const totals = fetchedShippingRate
    ? calculateOrderTotalWithDynamicRate(
        subtotal,
        fetchedShippingRate,
        shippingInfo.province || "ON",
      )
    : calculateOrderTotal(
        subtotal,
        selectedShippingMethod.id,
        shippingInfo.province || "ON",
      );

  // Normalize totals to have consistent shape (tax is totalTax or tax depending on source)
  const normalizedTotals = {
    subtotal: totals.subtotal,
    shipping: fetchedShippingRate ? totals.shipping : 0, // Only show shipping after rate is fetched
    tax: "totalTax" in totals ? totals.totalTax : totals.tax,
    total: fetchedShippingRate ? totals.total : subtotal, // Pre-shipping total
    shippingPending: !fetchedShippingRate, // Flag to show pending status
  };

  console.log(
    "Current step:",
    currentStep,
    "Fetched rate:",
    fetchedShippingRate,
  );
  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      toast.error("Please sign in to checkout");
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  // Redirect if cart is empty
  useEffect(() => {
    if (items.length === 0 && status === "authenticated") {
      toast.error("Your cart is empty");
      router.push("/cart");
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
        email: session.user.email || "",
      }));
    }
  }, [session]);

  const handleValidateCart = async () => {
    const result = await validateCart();

    if (!result) {
      toast.error("Failed to validate cart");
      return;
    }

    if (result.hasInvalidItems) {
      toast.error("Some items are no longer available. Redirecting to cart...");
      setTimeout(() => router.push("/cart"), 2000);
      return;
    }

    setValidationComplete(true);
  };

  const validateShippingForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!shippingInfo.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }
    if (!shippingInfo.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }
    if (
      !shippingInfo.email.trim() ||
      !/\S+@\S+\.\S+/.test(shippingInfo.email)
    ) {
      newErrors.email = "Valid email is required";
    }
    // Canadian phone format (10 digits)
    if (
      !shippingInfo.phone.trim() ||
      !/^\d{10}$/.test(shippingInfo.phone.replace(/\D/g, ""))
    ) {
      newErrors.phone = "Valid 10-digit phone number is required";
    }

    const addressValidation = validateCanadianAddress({
      street: shippingInfo.street,
      city: shippingInfo.city,
      province: shippingInfo.province,
      postalCode: shippingInfo.postalCode,
    });

    if (!addressValidation.isValid) {
      addressValidation.errors.forEach((error) => {
        if (error.includes("Street")) newErrors.street = error;
        if (error.includes("City")) newErrors.city = error;
        if (error.includes("province")) newErrors.province = error;
        if (error.includes("postal")) newErrors.postalCode = error;
      });
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Create shipment and get rate when proceeding to payment
  const handleProceedToPayment = async () => {
    if (!validateShippingForm()) {
      toast.error("Please fill in all required fields correctly");
      return;
    }

    setLoadingRates(true);

    try {
      // Create single shipment to get the actual rate
      const response = await axios.post("/api/shipping/create-quote", {
        address: {
          street: shippingInfo.street,
          apartment: shippingInfo.apartment,
          city: shippingInfo.city,
          province: shippingInfo.province,
          postalCode: shippingInfo.postalCode,
        },
        items: items.map((item) => ({
          productName: item.productName,
          quantity: item.quantity,
          price: item.price,
          variantSku: item.variantSku,
          variantId: item.id,
        })),
        recipient: {
          name: `${shippingInfo.firstName} ${shippingInfo.lastName}`,
          email: shippingInfo.email,
          phone: shippingInfo.phone,
        },
        postageType:
          selectedShippingMethod.id === "standard"
            ? "STANDARD"
            : selectedShippingMethod.id === "next_day"
              ? "NEXT DAY"
              : "SAME DAY",
      });

      if (response.data.success && response.data.rate) {
        setFetchedShippingRate(response.data.rate);
        toast.success("Shipping rate calculated");
        setCurrentStep("payment");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        throw new Error("Failed to get shipping rate");
      }
    } catch (error: any) {
      console.error("Error creating shipping quote:", error);
      toast.error(
        error.response?.data?.message ||
          "Could not calculate shipping rate. Please try again.",
      );
    } finally {
      setLoadingRates(false);
    }
  };

  const handleCreatePaymentIntent = async () => {
    if (!validateShippingForm()) {
      toast.error("Please verify your shipping information");
      setCurrentStep("shipping");
      return;
    }

    setIsProcessing(true);

    try {
      // Final cart validation
      const validationResult = await validateCart();
      if (!validationResult || validationResult.hasInvalidItems) {
        toast.error("Cart validation failed. Please review your cart.");
        router.push("/cart");
        return;
      }

      // Create payment intent (includes UniUni shipment creation)
      const response = await axios.post("/api/checkout/create-payment-intent", {
        items: items.map((item) => ({
          variantId: item.id,
          quantity: item.quantity,
          price: item.price,
          productName: item.productName,
          variantSku: item.variantSku,
        })),
        shippingAddress: {
          firstName: shippingInfo.firstName,
          lastName: shippingInfo.lastName,
          street: shippingInfo.street,
          apartment: shippingInfo.apartment,
          city: shippingInfo.city,
          state: shippingInfo.province, // API expects 'state' but it's actually province
          zipCode: shippingInfo.postalCode, // API expects 'zipCode'
        },
        billingAddress: billingSameAsShipping
          ? {
              firstName: shippingInfo.firstName,
              lastName: shippingInfo.lastName,
              street: shippingInfo.street,
              apartment: shippingInfo.apartment,
              city: shippingInfo.city,
              state: shippingInfo.province,
              zipCode: shippingInfo.postalCode,
            }
          : null,
        email: shippingInfo.email,
        phone: shippingInfo.phone,
        shippingMethodId:
          fetchedShippingRate?.postageType || selectedShippingMethod.id,
        selectedRate: fetchedShippingRate, // Pass the fetched rate for order reuse
        totals: normalizedTotals,
      });

      const { clientSecret, orderId } = response.data;

      // Store order ID for confirmation page
      sessionStorage.setItem("pendingOrderId", orderId);

      // Redirect to payment page with client secret
      router.push(
        `/checkout/payment?client_secret=${clientSecret}&order_id=${orderId}`,
      );
    } catch (error: any) {
      console.error("Payment intent creation error:", error);
      toast.error(
        error.response?.data?.error || "Failed to initialize payment",
      );
    } finally {
      setIsProcessing(false);
    }
  };

  if (status === "loading" || isValidating || items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
          <p className="text-gray-600">
            {isValidating ? "Validating cart..." : "Loading checkout..."}
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-48 bg-linear-to-b from-black/80 via-black/30 to-transparent pointer-events-none z-10" />
      <MaxWidthWrapper className="my-24">
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
                    currentStep === "shipping"
                      ? "bg-primary text-primary-foreground"
                      : "bg-primary text-primary-foreground"
                  }`}
                >
                  {currentStep === "payment" ? <Check size={20} /> : "1"}
                </div>
                <span className="font-medium text-gray-900">
                  Shipping Information
                </span>
              </div>

              <div className="w-16 h-0.5 bg-gray-300" />

              <div className="flex items-center gap-2">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    currentStep === "payment"
                      ? "bg-primary text-primary-foreground"
                      : "bg-gray-300 text-gray-600"
                  }`}
                >
                  2
                </div>
                <span
                  className={`font-medium ${
                    currentStep === "payment"
                      ? "text-gray-900"
                      : "text-gray-500"
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
              {currentStep === "shipping" && (
                <>
                  {/* Contact Information */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <MapPin className="text-primary" size={24} />
                      <h2 className="text-xl font-bold text-gray-900">
                        Contact Information
                      </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name *
                        </label>
                        <Input
                          className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                          type="text"
                          value={shippingInfo.firstName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              firstName: e.target.value,
                            })
                          }
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
                        <Input
                          className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                          type="text"
                          value={shippingInfo.lastName}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              lastName: e.target.value,
                            })
                          }
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
                        <Input
                          className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                          type="email"
                          value={shippingInfo.email}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              email: e.target.value,
                            })
                          }
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
                        <Input
                          className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                          type="tel"
                          value={shippingInfo.phone}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              phone: e.target.value,
                            })
                          }
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
                        <Input
                          className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                          type="text"
                          value={shippingInfo.street}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              street: e.target.value,
                            })
                          }
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
                        <Input
                          className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                          type="text"
                          value={shippingInfo.apartment}
                          onChange={(e) =>
                            setShippingInfo({
                              ...shippingInfo,
                              apartment: e.target.value,
                            })
                          }
                          placeholder="Apt 4B"
                        />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            City *
                          </label>
                          <Input
                            className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                            type="text"
                            value={shippingInfo.city}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                city: e.target.value,
                              })
                            }
                            placeholder="Toronto"
                          />
                          {errors.city && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.city}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Province *
                          </label>
                          <Select
                            value={shippingInfo.province}
                            onValueChange={(value) => {
                              setShippingInfo({
                                ...shippingInfo,
                                province: value,
                              });
                            }}
                          >
                            <SelectTrigger className="w-full px-3 py-2 h-10! shadow-input! bg-gray-50 border-none rounded-md text-sm text-black placeholder:text-neutral-400 focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:outline-none transition duration-400 ">
                              <SelectValue placeholder="Select Province" />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.entries(CANADIAN_PROVINCES).map(
                                ([code, name]) => (
                                  <SelectItem key={code} value={code}>
                                    {name}
                                  </SelectItem>
                                ),
                              )}
                            </SelectContent>
                          </Select>
                          {errors.province && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.province}
                            </p>
                          )}
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Postal Code *
                          </label>
                          <Input
                            className="dark:bg-gray-50 dark:text-black dark:shadow-input dark:focus-visible:ring-neutral-400"
                            type="text"
                            value={shippingInfo.postalCode}
                            onChange={(e) =>
                              setShippingInfo({
                                ...shippingInfo,
                                postalCode: e.target.value.toUpperCase(),
                              })
                            }
                            onBlur={(e) => {
                              const formatted = formatPostalCode(
                                e.target.value,
                              );
                              setShippingInfo({
                                ...shippingInfo,
                                postalCode: formatted,
                              });
                            }}
                            placeholder="A1A 1A1"
                            maxLength={7}
                          />
                          {errors.postalCode && (
                            <p className="text-sm text-red-600 mt-1">
                              {errors.postalCode}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Shipping Methods */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <Truck className="text-primary" size={24} />
                      <h3 className="text-lg font-bold text-gray-900">
                        Shipping Method
                      </h3>
                    </div>

                    {/* Info Alert */}
                    <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                      <Info className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-primary">
                        Select your preferred shipping method. The exact
                        shipping rate will be calculated when you continue to
                        payment.
                      </p>
                    </div>

                    <div className="space-y-3">
                      {SHIPPING_METHODS.map((method) => (
                        <label
                          key={method.id}
                          className={`flex items-center justify-between p-4 border-2 rounded-lg cursor-pointer transition ${
                            selectedShippingMethod.id === method.id
                              ? "border-primary bg-primary/5"
                              : "border-gray-200 hover:border-gray-300"
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <input
                              type="radio"
                              name="shipping"
                              checked={selectedShippingMethod.id === method.id}
                              onChange={() => setSelectedShippingMethod(method)}
                              className="w-5 h-5 text-primary accent-primary"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">
                                {method.name}
                              </p>
                              <p className="text-sm text-gray-600">
                                {method.description}
                              </p>
                            </div>
                          </div>
                          <span className="text-sm text-gray-500 italic">
                            Rate calculated at checkout
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Continue Button */}
                  <button
                    onClick={handleProceedToPayment}
                    disabled={loadingRates}
                    className={`w-full py-4 rounded-lg font-semibold transition-colors ${
                      loadingRates
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-primary hover:bg-primary/90"
                    } text-primary-foreground flex items-center justify-center gap-2`}
                  >
                    {loadingRates ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Calculating Shipping Rate...
                      </>
                    ) : (
                      "Continue to Payment"
                    )}
                  </button>
                </>
              )}

              {/* Payment Step - Keep existing payment step code */}
              {currentStep === "payment" && (
                <>
                  {/* Review Information */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-bold text-gray-900">
                        Review Your Information
                      </h3>
                      <button
                        onClick={() => setCurrentStep("shipping")}
                        className="text-primary hover:text-primary/90 text-sm font-medium"
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
                        <p className="text-sm text-gray-600">
                          Shipping Address
                        </p>
                        <p className="font-medium text-gray-900">
                          {shippingInfo.street}
                          {shippingInfo.apartment &&
                            `, ${shippingInfo.apartment}`}
                        </p>
                        <p className="text-sm text-gray-600">
                          {shippingInfo.city}, {shippingInfo.province}{" "}
                          {shippingInfo.postalCode}
                        </p>
                        <p className="text-sm text-gray-600">Canada</p>
                      </div>

                      <div>
                        <p className="text-sm text-gray-600">Shipping Method</p>
                        <p className="font-medium text-gray-900">
                          {selectedShippingMethod.name} -{" "}
                          {selectedShippingMethod.estimatedDays}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Payment Section */}
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center gap-2 mb-6">
                      <CreditCard className="text-primary" size={24} />
                      <h3 className="text-lg font-bold text-gray-900">
                        Payment
                      </h3>
                    </div>

                    <div className="bg-primary/5 rounded-lg p-6 mb-6 border border-primary/10">
                      <div className="flex items-start gap-3">
                        <Lock className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
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
                      className="w-full bg-primary text-primary-foreground py-4 rounded-lg font-semibold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
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
                      By placing your order, you agree to our Terms of Service
                      and Privacy Policy
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
                      <div className="relative w-16 h-16 mt-2 bg-gray-100 rounded-lg flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.productName}
                          fill
                          className="object-cover rounded-lg"
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
                            {[item.color, item.size]
                              .filter(Boolean)
                              .join(" • ")}
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
                      {formatCurrency(normalizedTotals.subtotal)}
                    </span>
                  </div>

                  <div className="flex justify-between text-gray-700">
                    <span>Shipping</span>
                    {normalizedTotals.shippingPending ? (
                      <span className="text-sm italic text-gray-500">
                        Calculated at next step
                      </span>
                    ) : (
                      <span className="font-semibold">
                        {formatCurrency(normalizedTotals.shipping)}
                      </span>
                    )}
                  </div>

                  {shippingInfo.province &&
                    !normalizedTotals.shippingPending && (
                      <div className="flex justify-between text-gray-700">
                        <span>Tax ({shippingInfo.province})</span>
                        <span className="font-semibold">
                          {formatCurrency(normalizedTotals.tax)}
                        </span>
                      </div>
                    )}

                  <div className="border-t pt-3 flex justify-between text-lg font-bold text-gray-900">
                    <span>Total</span>
                    {normalizedTotals.shippingPending ? (
                      <div className="text-right">
                        <span>{formatCurrency(normalizedTotals.subtotal)}</span>
                        <p className="text-xs font-normal text-gray-500">
                          + shipping
                        </p>
                      </div>
                    ) : (
                      <span>{formatCurrency(normalizedTotals.total)}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </MaxWidthWrapper>
    </>
  );
}
