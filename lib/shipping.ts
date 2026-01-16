// src/lib/shipping.ts
/**
 * Professional shipping calculation for USA e-commerce
 * Based on industry standards for clothing retailers
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
    price: 5.99,
    estimatedDays: '5-7 business days',
    carrier: 'USPS',
  },
  {
    id: 'express',
    name: 'Express Shipping',
    description: 'Delivery in 2-3 business days',
    price: 12.99,
    estimatedDays: '2-3 business days',
    carrier: 'FedEx',
  },
  {
    id: 'overnight',
    name: 'Overnight Shipping',
    description: 'Next business day delivery',
    price: 24.99,
    estimatedDays: 'Next business day',
    carrier: 'FedEx Express',
  },
];

export const FREE_SHIPPING_THRESHOLD = 75; // Free shipping over $75

/**
 * Calculate shipping cost based on cart subtotal and selected method
 */
export function calculateShipping(
  subtotal: number,
  shippingMethodId: string
): number {
  // Free shipping for orders over threshold
  if (subtotal >= FREE_SHIPPING_THRESHOLD) {
    return 0;
  }

  // Find selected shipping method
  const method = SHIPPING_METHODS.find((m) => m.id === shippingMethodId);

  if (!method) {
    // Default to standard shipping
    return SHIPPING_METHODS[0].price;
  }

  return method.price;
}

/**
 * Check if order qualifies for free shipping
 */
export function qualifiesForFreeShipping(subtotal: number): boolean {
  return subtotal >= FREE_SHIPPING_THRESHOLD;
}

/**
 * Calculate how much more needed for free shipping
 */
export function amountUntilFreeShipping(subtotal: number): number {
  if (qualifiesForFreeShipping(subtotal)) {
    return 0;
  }
  return FREE_SHIPPING_THRESHOLD - subtotal;
}

/**
 * Calculate sales tax for USA states
 * Note: In production, use a tax API like TaxJar or Avalara
 */
export const STATE_TAX_RATES: Record<string, number> = {
  AL: 0.04, // Alabama
  AK: 0.0, // Alaska
  AZ: 0.056, // Arizona
  AR: 0.065, // Arkansas
  CA: 0.0725, // California
  CO: 0.029, // Colorado
  CT: 0.0635, // Connecticut
  DE: 0.0, // Delaware
  FL: 0.06, // Florida
  GA: 0.04, // Georgia
  HI: 0.04, // Hawaii
  ID: 0.06, // Idaho
  IL: 0.0625, // Illinois
  IN: 0.07, // Indiana
  IA: 0.06, // Iowa
  KS: 0.065, // Kansas
  KY: 0.06, // Kentucky
  LA: 0.0445, // Louisiana
  ME: 0.055, // Maine
  MD: 0.06, // Maryland
  MA: 0.0625, // Massachusetts
  MI: 0.06, // Michigan
  MN: 0.06875, // Minnesota
  MS: 0.07, // Mississippi
  MO: 0.04225, // Missouri
  MT: 0.0, // Montana
  NE: 0.055, // Nebraska
  NV: 0.0685, // Nevada
  NH: 0.0, // New Hampshire
  NJ: 0.06625, // New Jersey
  NM: 0.05125, // New Mexico
  NY: 0.04, // New York
  NC: 0.0475, // North Carolina
  ND: 0.05, // North Dakota
  OH: 0.0575, // Ohio
  OK: 0.045, // Oklahoma
  OR: 0.0, // Oregon
  PA: 0.06, // Pennsylvania
  RI: 0.07, // Rhode Island
  SC: 0.06, // South Carolina
  SD: 0.045, // South Dakota
  TN: 0.07, // Tennessee
  TX: 0.0625, // Texas
  UT: 0.0485, // Utah
  VT: 0.06, // Vermont
  VA: 0.053, // Virginia
  WA: 0.065, // Washington
  WV: 0.06, // West Virginia
  WI: 0.05, // Wisconsin
  WY: 0.04, // Wyoming
};

/**
 * Calculate sales tax based on state
 */
export function calculateTax(subtotal: number, stateCode: string): number {
  const taxRate = STATE_TAX_RATES[stateCode.toUpperCase()] || 0;
  return subtotal * taxRate;
}

/**
 * Calculate order totals
 */
export function calculateOrderTotal(
  subtotal: number,
  shippingMethodId: string,
  stateCode: string
): {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
} {
  const shipping = calculateShipping(subtotal, shippingMethodId);
  const taxableAmount = subtotal + shipping;
  const tax = calculateTax(taxableAmount, stateCode);
  const total = taxableAmount + tax;

  return {
    subtotal,
    shipping,
    tax,
    total,
  };
}

/**
 * Validate USA shipping address
 */
export function validateUSAddress(address: {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!address.street || address.street.trim().length < 5) {
    errors.push('Street address is required');
  }

  if (!address.city || address.city.trim().length < 2) {
    errors.push('City is required');
  }

  if (!address.state || !STATE_TAX_RATES[address.state.toUpperCase()]) {
    errors.push('Valid US state is required');
  }

  // Validate ZIP code (5 digits or 5+4 format)
  const zipRegex = /^\d{5}(-\d{4})?$/;
  if (!address.zipCode || !zipRegex.test(address.zipCode)) {
    errors.push('Valid ZIP code is required (e.g., 12345 or 12345-6789)');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

/**
 * Get state name from code
 */
export const US_STATES: Record<string, string> = {
  AL: 'Alabama',
  AK: 'Alaska',
  AZ: 'Arizona',
  AR: 'Arkansas',
  CA: 'California',
  CO: 'Colorado',
  CT: 'Connecticut',
  DE: 'Delaware',
  FL: 'Florida',
  GA: 'Georgia',
  HI: 'Hawaii',
  ID: 'Idaho',
  IL: 'Illinois',
  IN: 'Indiana',
  IA: 'Iowa',
  KS: 'Kansas',
  KY: 'Kentucky',
  LA: 'Louisiana',
  ME: 'Maine',
  MD: 'Maryland',
  MA: 'Massachusetts',
  MI: 'Michigan',
  MN: 'Minnesota',
  MS: 'Mississippi',
  MO: 'Missouri',
  MT: 'Montana',
  NE: 'Nebraska',
  NV: 'Nevada',
  NH: 'New Hampshire',
  NJ: 'New Jersey',
  NM: 'New Mexico',
  NY: 'New York',
  NC: 'North Carolina',
  ND: 'North Dakota',
  OH: 'Ohio',
  OK: 'Oklahoma',
  OR: 'Oregon',
  PA: 'Pennsylvania',
  RI: 'Rhode Island',
  SC: 'South Carolina',
  SD: 'South Dakota',
  TN: 'Tennessee',
  TX: 'Texas',
  UT: 'Utah',
  VT: 'Vermont',
  VA: 'Virginia',
  WA: 'Washington',
  WV: 'West Virginia',
  WI: 'Wisconsin',
  WY: 'Wyoming',
};
