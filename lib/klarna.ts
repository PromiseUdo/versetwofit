// src/lib/klarna.ts
import axios from 'axios';

const KLARNA_API_URL =
  process.env.KLARNA_API_URL || 'https://api.playground.klarna.com';
const KLARNA_USERNAME = process.env.KLARNA_USERNAME!;
const KLARNA_PASSWORD = process.env.KLARNA_PASSWORD!;

const klarnaClient = axios.create({
  baseURL: KLARNA_API_URL,
  auth: {
    username: KLARNA_USERNAME,
    password: KLARNA_PASSWORD,
  },
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface KlarnaSessionRequest {
  purchase_country: string;
  purchase_currency: string;
  locale: string;
  order_amount: number;
  order_tax_amount: number;
  order_lines: Array<{
    name: string;
    quantity: number;
    unit_price: number;
    tax_rate: number;
    total_amount: number;
    total_tax_amount: number;
    image_url?: string;
  }>;
  merchant_urls: {
    terms: string;
    checkout: string;
    confirmation: string;
    push: string;
  };
}

export async function createKlarnaSession(data: KlarnaSessionRequest) {
  try {
    const response = await klarnaClient.post('/payments/v1/sessions', data);
    return response.data;
  } catch (error: any) {
    console.error(
      'Klarna session creation error:',
      error.response?.data || error.message
    );
    throw new Error('Failed to create Klarna session');
  }
}

export async function createKlarnaOrder(authToken: string, orderData: any) {
  try {
    const response = await klarnaClient.post(
      `/payments/v1/authorizations/${authToken}/order`,
      orderData
    );
    return response.data;
  } catch (error: any) {
    console.error(
      'Klarna order creation error:',
      error.response?.data || error.message
    );
    throw new Error('Failed to create Klarna order');
  }
}
