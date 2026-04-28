
// src/lib/shipping.ts
/**
 * Shipping utilities for Canadian e-commerce with UniUni integration
 */

export type ShippingMethod = {
  id: string;
  name: string;
  description: string;
  price: number;
  estimatedDays: string;
  carrier?: string;
};

export const SHIPPING_METHODS: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Standard Shipping',
    description: 'Delivery in 5-7 business days',
    price: 12.99,
    estimatedDays: '5-7 business days',
    carrier: 'UniUni',
  },
];

/**
 * Calculate shipping cost based on selected method
 * FREE SHIPPING REMOVED - All shipments now have a cost
 */
export function calculateShipping(shippingMethodId: string): number {
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethodId);

  if (!method) {
    // Default to standard shipping
    return SHIPPING_METHODS[0].price;
  }

  return method.price;
}

/**
 * Calculate sales tax for Canadian provinces
 * GST/HST/PST rates as of 2024
 */
export const PROVINCE_TAX_RATES: Record<
  string,
  {
    gst: number;
    pst: number;
    hst: number;
    total: number;
    name: string;
  }
> = {
  AB: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Alberta' },
  BC: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'British Columbia' },
  MB: { gst: 0.05, pst: 0.07, hst: 0, total: 0.12, name: 'Manitoba' },
  NB: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'New Brunswick' },
  NL: {
    gst: 0,
    pst: 0,
    hst: 0.15,
    total: 0.15,
    name: 'Newfoundland and Labrador',
  },
  NT: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Northwest Territories' },
  NS: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'Nova Scotia' },
  NU: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Nunavut' },
  ON: { gst: 0, pst: 0, hst: 0.13, total: 0.13, name: 'Ontario' },
  PE: { gst: 0, pst: 0, hst: 0.15, total: 0.15, name: 'Prince Edward Island' },
  QC: { gst: 0.05, pst: 0.09975, hst: 0, total: 0.14975, name: 'Quebec' },
  SK: { gst: 0.05, pst: 0.06, hst: 0, total: 0.11, name: 'Saskatchewan' },
  YT: { gst: 0.05, pst: 0, hst: 0, total: 0.05, name: 'Yukon' },
};

/**
 * Calculate sales tax based on province
 */
export function calculateTax(subtotal: number, provinceCode: string): number {
  const taxInfo = PROVINCE_TAX_RATES[provinceCode.toUpperCase()];
  if (!taxInfo) return 0;

  return subtotal * taxInfo.total;
}

/**
 * Calculate order totals
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingMethodId: string,
  provinceCode: string,
): {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
} {
  const shipping = calculateShipping(shippingMethodId);
  const taxableAmount = subtotal + shipping;
  const tax = calculateTax(taxableAmount, provinceCode);
  const total = taxableAmount + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
}

/**
 * Dynamic shipping rate from UniUni API
 */
export type DynamicShippingRate = {
  postageType: string;
  postageFee: number;
  tax: number;
  total: number;
  currency: string;
  orderNumber: string | null;
  estimatedDays: string;
  name: string;
  isEstimate?: boolean;
};

/**
 * Calculate order totals using dynamic shipping rate from UniUni
 * Uses actual postageFee and tax from the API response
 */
export function calculateOrderTotalWithDynamicRate(
  subtotal: number,
  selectedRate: DynamicShippingRate,
  provinceCode: string,
): {
  subtotal: number;
  shipping: number;
  shippingTax: number;
  productTax: number;
  totalTax: number;
  total: number;
} {
  // Use the rate's postageFee as shipping cost
  const shipping = selectedRate.postageFee;
  
  // The rate's tax is already the shipping tax from UniUni
  const shippingTax = selectedRate.tax;
  
  // Calculate tax on products based on province
  const productTax = calculateTax(subtotal, provinceCode);
  
  // Total tax = product tax + shipping tax
  const totalTax = productTax + shippingTax;
  
  // Total = subtotal + shipping + total tax
  const total = subtotal + shipping + totalTax;

  return {
    subtotal,
    shipping,
    shippingTax,
    productTax,
    totalTax,
    total,
  };
}

/**
 * Validate Canadian shipping address
 */
export function validateCanadianAddress(address: {
  street: string;
  city: string;
  province: string;
  postalCode: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!address.street || address.street.trim().length < 5) {
    errors.push('Street address is required');
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is required');
  }

  if (
    !address.province ||
    !PROVINCE_TAX_RATES[address.province.toUpperCase()]
  ) {
    errors.push('Valid Canadian province is required');
  }

  // Validate Canadian postal code (A1A 1A1 format)
  const postalRegex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
  if (!address.postalCode || !postalRegex.test(address.postalCode.trim())) {
    errors.push('Valid Canadian postal code is required (e.g., A1A 1A1)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format currency for display (Canadian dollars)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-CA', {
    style: 'currency',
    currency: 'CAD',
  }).format(amount);
}

/**
 * Get province name from code
 */
export const CANADIAN_PROVINCES: Record<string, string> = {
  AB: 'Alberta',
  BC: 'British Columbia',
  MB: 'Manitoba',
  NB: 'New Brunswick',
  NL: 'Newfoundland and Labrador',
  NT: 'Northwest Territories',
  NS: 'Nova Scotia',
  NU: 'Nunavut',
  ON: 'Ontario',
  PE: 'Prince Edward Island',
  QC: 'Quebec',
  SK: 'Saskatchewan',
  YT: 'Yukon',
};

/**
 * Format Canadian postal code
 */
export function formatPostalCode(postalCode: string): string {
  const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
  if (cleaned.length === 6) {
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
  }
  return postalCode;
}

/**
 * Map shipping method ID to UniUni postage type
 * NOTE: UniUni uses spaces, not underscores (e.g., "SAME DAY" not "SAME_DAY")
 */
export function getUniUniPostageType(
  shippingMethodId: string,
): 'STANDARD' | 'NEXT DAY' | 'SAME DAY' {
  switch (shippingMethodId) {
    case 'same_day':
      return 'SAME DAY';
    case 'next_day':
      return 'NEXT DAY';
    case 'standard':
    default:
      return 'STANDARD';
  }
}
