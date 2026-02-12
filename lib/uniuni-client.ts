
// // src/lib/uniuni-client.ts
// /**
//  * UniUni Shipping API Client - CORRECTED VERSION
//  * For Canadian e-commerce shipping integration
//  */

// const UNIUNI_API_BASE_URL =
//   process.env.UNIUNI_API_URL || 'https://api-sandbox.ship.uniuni.com';
// const UNIUNI_ACCESS_TOKEN = process.env.UNIUNI_ACCESS_TOKEN;

// if (!UNIUNI_ACCESS_TOKEN) {
//   console.warn(
//     'UNIUNI_ACCESS_TOKEN is not set. UniUni features will not work.',
//   );
// }

// // Types based on UniUni API documentation
// export interface UniUniRecipient {
//   name: string;
//   phone: string;
//   email: string;
// }

// // CORRECTED: UniUni uses "address1" not "street"
// export interface UniUniAddress {
//   address1: string; // Main street address (REQUIRED)
//   address2?: string; // Apartment, suite, etc (OPTIONAL)
//   city: string;
//   province: string; // For Canada: ON, BC, AB, etc.
//   postalCode: string;
//   country: string; // 'CA' for Canada
// }

// // CORRECTED: UniUni requires dimensionUnit
// export interface UniUniDimensions {
//   length: number;
//   width: number;
//   height: number;
//   dimensionUnit: 'CM' | 'INCH' | 'M' | 'FT'; // REQUIRED
// }

// // CORRECTED: UniUni requires weightUnit
// export interface UniUniWeight {
//   value: number;
//   weightUnit: 'G' | 'KG' | 'LB' | 'OZ'; // REQUIRED
// }

// export interface ShipmentLineItem {
//   description: string;
//   quantity: number;
//   unit_value: number;
//   currency: 'CAD' | 'USD';
//   hs_code?: string;
//   country_of_origin?: string;
//   sku?: string;
// }

// export type PostageType = 'SAME_DAY' | 'NEXT_DAY' | 'STANDARD';

// export interface CreateShipmentRequest {
//   recipient: UniUniRecipient;
//   address: UniUniAddress;
//   dimensions: UniUniDimensions;
//   weight: UniUniWeight;
//   postageType: PostageType;
//   note?: string;
//   shipmentLineItems: ShipmentLineItem[];
// }

// export interface ClientBillingSummary {
//   subtotal: number;
//   tax: number;
//   total: number;
//   currency: string;
// }

// export interface CreateShipmentResponse {
//   orderNumber: string;
//   trackingId: string;
//   recipient: UniUniRecipient;
//   address: UniUniAddress;
//   dimensions: UniUniDimensions;
//   weight: UniUniWeight;
//   status: string;
//   note?: string;
//   createdAt: string;
//   updatedAt: string;
//   rates: ClientBillingSummary;
//   shipmentLineItems: ShipmentLineItem[];
// }

// /**
//  * UniUni API Client
//  */
// class UniUniClient {
//   private baseUrl: string;
//   private accessToken: string | undefined;

//   constructor(baseUrl: string, accessToken: string | undefined) {
//     this.baseUrl = baseUrl;
//     this.accessToken = accessToken;
//   }

//   private getHeaders(): HeadersInit {
//     if (!this.accessToken) {
//       throw new Error('UniUni access token is not configured');
//     }

//     return {
//       'Content-Type': 'application/json',
//       Authorization: `Bearer ${this.accessToken}`,
//     };
//   }

//   /**
//    * Create a shipment with UniUni
//    */
//   async createShipment(
//     data: CreateShipmentRequest,
//   ): Promise<CreateShipmentResponse> {
//     try {
//       console.log(
//         '🚀 Calling UniUni API:',
//         `${this.baseUrl}/client/shipments/create`,
//       );
//       console.log('📦 Request payload:', JSON.stringify(data, null, 2));

//       const response = await fetch(`${this.baseUrl}/client/shipments/create`, {
//         method: 'POST',
//         headers: this.getHeaders(),
//         body: JSON.stringify(data),
//       });

//       const responseText = await response.text();
//       console.log('📥 Raw response:', responseText);

//       if (!response.ok) {
//         let errorData;
//         try {
//           errorData = JSON.parse(responseText);
//         } catch {
//           errorData = { message: responseText };
//         }

//         throw new Error(
//           errorData.message ||
//           `UniUni API error: ${response.status} ${response.statusText}`,
//         );
//       }

//       const result = JSON.parse(responseText);
//       console.log('✅ UniUni shipment created successfully:', result);

//       return result;
//     } catch (error) {
//       console.error('❌ Error creating UniUni shipment:', error);
//       throw error;
//     }
//   }

//   /**
//    * Get estimated shipping rates
//    */
//   async getShippingRates(
//     address: UniUniAddress,
//     dimensions: UniUniDimensions,
//     weight: UniUniWeight,
//   ): Promise<
//     {
//       postageType: PostageType;
//       estimatedCost: number;
//       estimatedDays: string;
//       description: string;
//     }[]
//   > {
//     // Since UniUni doesn't provide a rate-only endpoint, return standard estimates
//     const baseRates = [
//       {
//         postageType: 'STANDARD' as PostageType,
//         estimatedCost: 12.99,
//         estimatedDays: '5-7 business days',
//         description: 'Standard Shipping',
//       },
//       {
//         postageType: 'NEXT_DAY' as PostageType,
//         estimatedCost: 24.99,
//         estimatedDays: '1 business day',
//         description: 'Next Day Shipping',
//       },
//       {
//         postageType: 'SAME_DAY' as PostageType,
//         estimatedCost: 39.99,
//         estimatedDays: 'Same day',
//         description: 'Same Day Shipping',
//       },
//     ];

//     // Adjust rates based on weight (add $2 per kg over 1kg)
//     const weightSurcharge = Math.max(0, (weight.value - 1) * 2);

//     return baseRates.map((rate) => ({
//       ...rate,
//       estimatedCost: rate.estimatedCost + weightSurcharge,
//     }));
//   }

//   /**
//    * Get shipment details by order number
//    */
//   async getShipment(orderNumber: string): Promise<CreateShipmentResponse> {
//     try {
//       const response = await fetch(
//         `${this.baseUrl}/client/shipments/${orderNumber}`,
//         {
//           method: 'GET',
//           headers: this.getHeaders(),
//         },
//       );

//       if (!response.ok) {
//         throw new Error(`Failed to get shipment: ${response.statusText}`);
//       }

//       return await response.json();
//     } catch (error) {
//       console.error('Error getting UniUni shipment:', error);
//       throw error;
//     }
//   }

//   /**
//    * Validate Canadian postal code
//    */
//   isValidCanadianPostalCode(postalCode: string): boolean {
//     const regex = /^[A-Z]\d[A-Z]\s?\d[A-Z]\d$/i;
//     return regex.test(postalCode.trim());
//   }

//   /**
//    * Format Canadian postal code
//    */
//   formatCanadianPostalCode(postalCode: string): string {
//     const cleaned = postalCode.replace(/\s/g, '').toUpperCase();
//     if (cleaned.length === 6) {
//       return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
//     }
//     return postalCode;
//   }
// }

// // Export singleton instance
// export const uniUniClient = new UniUniClient(
//   UNIUNI_API_BASE_URL,
//   UNIUNI_ACCESS_TOKEN,
// );

// /**
//  * Helper function to convert cart items to UniUni shipment line items
//  */
// export function cartItemsToShipmentLineItems(
//   items: {
//     productName: string;
//     quantity: number;
//     price: number;
//     variantSku?: string;
//   }[],
// ): ShipmentLineItem[] {
//   return items.map((item) => ({
//     description: item.productName,
//     quantity: item.quantity,
//     unit_value: item.price,
//     currency: 'CAD' as const,
//     sku: item.variantSku || undefined,
//   }));
// }

// /**
//  * Helper function to estimate package dimensions
//  * Returns dimensions in CM with dimensionUnit
//  */
// export function estimatePackageDimensions(items: any[]): UniUniDimensions {
//   // Default dimensions for a medium box
//   // TODO: Calculate based on actual product dimensions
//   return {
//     length: 30,
//     width: 25,
//     height: 15,
//     dimensionUnit: 'CM', // REQUIRED by UniUni API
//   };
// }

// /**´
//  * Helper function to estimate package weight
//  * Returns weight in KG with weightUnit
//  */
// export function estimatePackageWeight(items: any[]): UniUniWeight {
//   // Default weight calculation
//   // TODO: Calculate based on actual product weights
//   const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
//   const estimatedKg = Math.max(0.5, totalItems * 0.3); // 0.3kg per item, minimum 0.5kg

//   return {
//     value: Math.round(estimatedKg * 100) / 100, // Round to 2 decimal places
//     weightUnit: 'KG', // REQUIRED by UniUni API
//   };
// }

// /**
//  * Helper to convert address from your form format to UniUni format
//  */
// export function convertToUniUniAddress(address: {
//   street: string;
//   apartment?: string;
//   city: string;
//   province: string;
//   postalCode: string;
// }): UniUniAddress {
//   return {
//     address1: address.street, // REQUIRED: Main address
//     address2: address.apartment || undefined, // OPTIONAL: Apartment/suite
//     city: address.city,
//     province: address.province,
//     postalCode: address.postalCode,
//     country: 'CA',
//   };
// }






/**
 * UniUni Shipping API Client
 * Optimized for Canadian e-commerce integration.
 * Handles the full lifecycle: Creation (Draft) -> Confirmation (Paid) -> Label Generation.
 */

const UNIUNI_API_BASE_URL =
  process.env.UNIUNI_API_URL || 'https://api-sandbox.ship.uniuni.com';
const UNIUNI_ACCESS_TOKEN = process.env.UNIUNI_ACCESS_TOKEN;

if (!UNIUNI_ACCESS_TOKEN) {
  console.warn(
    'UNIUNI_ACCESS_TOKEN is not set. UniUni features will not work.',
  );
}

// --- Interfaces ---

export interface UniUniRecipient {
  name: string;
  phone: string;
  email: string;
}

export interface UniUniAddress {
  address1: string; // Main street address
  address2?: string; // Apartment, suite, etc
  city: string;
  province: string; // ON, BC, AB, etc.
  postalCode: string;
  country: string; // 'CA'
}

export interface UniUniDimensions {
  length: number;
  width: number;
  height: number;
  dimensionUnit: 'CM' | 'INCH' | 'M' | 'FT';
}

export interface UniUniWeight {
  value: number;
  weightUnit: 'G' | 'KG' | 'LB' | 'OZ';
}

export interface ShipmentLineItem {
  description: string;
  quantity: number;
  unit_value: number;
  currency: 'CAD' | 'USD';
  hs_code?: string;
  country_of_origin?: string;
  sku?: string;
}

// NOTE: UniUni API uses spaces in postageType values, not underscores
export type PostageType = 'SAME DAY' | 'NEXT DAY' | 'STANDARD';

export interface CreateShipmentRequest {
  recipient: UniUniRecipient;
  address: UniUniAddress;
  dimensions: UniUniDimensions;
  weight: UniUniWeight;
  postageType: PostageType;
  note?: string;
  shipmentLineItems: ShipmentLineItem[];
}

export interface UniUniRates {
  postageType: string;
  postageFee: number;
  tax: number;
  total: number;
  currency: string;
}

export interface CreateShipmentResponse {
  orderNumber: string;
  trackingId: string;
  status: string;
  labelUrl?: string;
  rates: UniUniRates;
}

// --- Client Class ---

class UniUniClient {
  private baseUrl: string;
  private accessToken: string | undefined;

  constructor(baseUrl: string, accessToken: string | undefined) {
    this.baseUrl = baseUrl;
    this.accessToken = accessToken;
  }

  private getHeaders(): HeadersInit {
    if (!this.accessToken) {
      throw new Error('UniUni access token is not configured');
    }

    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.accessToken}`,
    };
  }

  /**
   * STEP 1: Create a shipment (Initially in DRAFT status)
   */
  async createShipment(
    data: CreateShipmentRequest,
  ): Promise<CreateShipmentResponse> {
    try {
      console.log('🚀 Creating UniUni Draft Shipment...');
      const response = await fetch(`${this.baseUrl}/client/shipments/create`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(data),
      });

      const responseText = await response.text();

      if (!response.ok) {
        const errorData = JSON.parse(responseText);
        throw new Error(errorData.message || `API Error: ${response.status}`);
      }

      return JSON.parse(responseText);
    } catch (error) {
      console.error('❌ UniUni createShipment failed:', error);
      throw error;
    }
  }

  /**
   * STEP 2: Confirm/Pay for the shipment (Moves from DRAFT to ORDERED)
   * This logic is critical for your Stripe Webhook.
   */
  async confirmShipment(orderNumber: string): Promise<any> {
    const url = `${this.baseUrl}/client/orders/create`;
    const payload = { orderNumbers: [orderNumber] };
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`💳 UniUni confirmShipment Debug:`);
    console.log(`   URL: ${url}`);
    console.log(`   Order Number: ${orderNumber}`);
    console.log(`   Payload:`, JSON.stringify(payload));
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload),
      });

      const responseText = await response.text();
      console.log(`📥 UniUni Response Status: ${response.status}`);
      console.log(`📥 UniUni Response Body:`, responseText);

      if (!response.ok) {
        const errorData = responseText ? JSON.parse(responseText) : { message: 'Unknown error' };
        throw new Error(errorData.message || `Confirmation failed: ${response.status}`);
      }

      const result = JSON.parse(responseText);
      console.log('✅ UniUni Order Confirmed/Paid successfully');
      return result;
    } catch (error) {
      console.error('❌ UniUni confirmShipment failed:', error);
      throw error;
    }
  }

  /**
   * STEP 3: Get Shipping Label (PDF)
   */
  async getLabel(orderNumber: string): Promise<{ labelUrl: string }> {
    try {
      const response = await fetch(
        `${this.baseUrl}/client/shipments/${orderNumber}/label`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) {
        throw new Error(`Failed to get label: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('❌ UniUni getLabel failed:', error);
      throw error;
    }
  }

  /**
   * GET LIVE SHIPPING RATES FROM UNIUNI
   * Creates draft shipments for each postage type to get actual rates
   * Returns the real postageFee, tax, and total from UniUni's response
   */
  async getQuotedRates(
    recipient: UniUniRecipient,
    address: UniUniAddress,
    dimensions: UniUniDimensions,
    weight: UniUniWeight,
    shipmentLineItems: ShipmentLineItem[],
  ): Promise<{
    postageType: PostageType;
    postageFee: number;
    tax: number;
    total: number;
    currency: string;
    orderNumber: string; // Draft order number for potential reuse
    estimatedDays: string;
    name: string;
  }[]> {
    const postageTypes: { type: PostageType; name: string; estimatedDays: string }[] = [
      { type: 'STANDARD', name: 'Standard Shipping', estimatedDays: '3-5 business days' },
      { type: 'NEXT DAY', name: 'Next Day Shipping', estimatedDays: '1 business day' },
      { type: 'SAME DAY', name: 'Same Day Shipping', estimatedDays: 'Same day' },
    ];

    const rates: any[] = [];

    for (const { type, name, estimatedDays } of postageTypes) {
      try {
        console.log(`📊 Fetching rate for postage type: ${type}`);
        
        const response = await this.createShipment({
          recipient,
          address,
          dimensions,
          weight,
          postageType: type,
          note: 'Rate Quote',
          shipmentLineItems,
        });

        rates.push({
          postageType: type,
          postageFee: response.rates.postageFee,
          tax: response.rates.tax,
          total: response.rates.total,
          currency: response.rates.currency || 'CAD',
          orderNumber: response.orderNumber,
          estimatedDays,
          name,
        });

        console.log(`✅ Rate for ${type}: $${response.rates.postageFee} + tax $${response.rates.tax} = $${response.rates.total}`);
      } catch (error) {
        console.error(`❌ Failed to get rate for ${type}:`, error);
        // Skip this rate if API call fails
      }
    }

    return rates;
  }

  /**
   * GET SHIPPING RATES (Fallback with estimates)
   * Used when live rates cannot be fetched
   */
  async getShippingRates(
    address: UniUniAddress,
    dimensions: UniUniDimensions,
    weight: UniUniWeight,
  ): Promise<
    {
      postageType: PostageType;
      estimatedCost: number;
      estimatedDays: string;
      description: string;
    }[]
  > {
    // Fallback: Return estimated rates based on weight
    const baseRates = [
      {
        postageType: 'STANDARD' as PostageType,
        estimatedCost: 12.99,
        estimatedDays: '3-5 business days',
        description: 'Standard Shipping',
      },
      {
        postageType: 'NEXT DAY' as PostageType,
        estimatedCost: 22.99,
        estimatedDays: '1 business day',
        description: 'Next Day Shipping',
      },
      {
        postageType: 'SAME DAY' as PostageType,
        estimatedCost: 34.99,
        estimatedDays: 'Same day',
        description: 'Same Day Shipping',
      },
    ];

    // Simple business logic: Add $1.50 per KG over 1KG
    const weightSurcharge = Math.max(0, (weight.value - 1) * 1.5);

    return baseRates.map((rate) => ({
      ...rate,
      estimatedCost: Number((rate.estimatedCost + weightSurcharge).toFixed(2)),
    }));
  }

  /**
   * Utility: Get shipment details/tracking status
   */
  async getShipment(orderNumber: string): Promise<any> {
    try {
      const response = await fetch(
        `${this.baseUrl}/client/shipments/${orderNumber}`,
        {
          method: 'GET',
          headers: this.getHeaders(),
        },
      );

      if (!response.ok) throw new Error(`Fetch failed: ${response.statusText}`);
      return await response.json();
    } catch (error) {
      console.error('Error getting shipment:', error);
      throw error;
    }
  }
}

// --- Singleton Export ---

export const uniUniClient = new UniUniClient(
  UNIUNI_API_BASE_URL,
  UNIUNI_ACCESS_TOKEN,
);

// --- Helper Functions ---

export function cartItemsToShipmentLineItems(
  items: {
    productName: string;
    quantity: number;
    price: number;
    variantSku?: string;
  }[],
): ShipmentLineItem[] {
  return items.map((item) => ({
    description: item.productName,
    quantity: item.quantity,
    unit_value: item.price,
    currency: 'CAD' as const,
    sku: item.variantSku || undefined,
  }));
}

export function estimatePackageDimensions(items: any[]): UniUniDimensions {
  // Default dimensions if no item dimensions provided
  const DEFAULT_LENGTH = 30;
  const DEFAULT_WIDTH = 25;
  const DEFAULT_HEIGHT = 15;


  console.log(items, 'from estimate package dimension');
  
  if (!items || items.length === 0) {
    return {
      length: DEFAULT_LENGTH,
      width: DEFAULT_WIDTH,
      height: DEFAULT_HEIGHT,
      dimensionUnit: 'CM',
    };
  }

  // Calculate dimensions based on items
  // For multiple items, we estimate the box size needed
  let maxLength = 0;
  let maxWidth = 0;
  let totalHeight = 0;

  for (const item of items) {
    const qty = item.quantity || 1;
    const itemLength = item.length || DEFAULT_LENGTH;
    const itemWidth = item.width || DEFAULT_WIDTH;
    const itemHeight = item.height || DEFAULT_HEIGHT;

    // Use the largest length/width across all items
    maxLength = Math.max(maxLength, itemLength);
    maxWidth = Math.max(maxWidth, itemWidth);

    // Stack items vertically (simplified packing)
    totalHeight += itemHeight * qty;
  }

  return {
    length: Math.ceil(maxLength),
    width: Math.ceil(maxWidth),
    height: Math.ceil(Math.max(totalHeight, DEFAULT_HEIGHT)), // Min height
    dimensionUnit: 'CM',
  };
}

export function estimatePackageWeight(items: any[]): UniUniWeight {
  const DEFAULT_WEIGHT_PER_ITEM = 0.3; // kg per item if no weight specified

  if (!items || items.length === 0) {
    return {
      value: 0.5,
      weightUnit: 'KG',
    };
  }

  let totalWeight = 0;

  for (const item of items) {
    const qty = item.quantity || 1;
    const itemWeight = item.weight || DEFAULT_WEIGHT_PER_ITEM;
    totalWeight += itemWeight * qty;
  }

  // Minimum weight of 0.5kg for shipping
  const finalWeight = Math.max(0.5, totalWeight);

  return {
    value: Math.round(finalWeight * 100) / 100,
    weightUnit: 'KG',
  };
}

export function convertToUniUniAddress(address: {
  street: string;
  apartment?: string;
  city: string;
  province: string;
  postalCode: string;
}): UniUniAddress {
  return {
    address1: address.street,
    address2: address.apartment || undefined,
    city: address.city,
    province: address.province,
    postalCode: address.postalCode,
    country: 'CA',
  };
}