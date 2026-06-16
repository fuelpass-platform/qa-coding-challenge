import type {
  CreateOrderPayload,
  FuelOrder,
  FuelReferencePrice,
  OrderStatus,
} from './types';

const BASE = '/api';

async function http<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Request failed (${res.status}): ${body}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  listOrders(status?: OrderStatus): Promise<FuelOrder[]> {
    const qs = status ? `?status=${encodeURIComponent(status)}` : '';
    return http<FuelOrder[]>(`${BASE}/orders${qs}`);
  },
  getOrder(id: number): Promise<FuelOrder> {
    return http<FuelOrder>(`${BASE}/orders/${id}`);
  },
  createOrder(payload: CreateOrderPayload): Promise<FuelOrder> {
    return http<FuelOrder>(`${BASE}/orders`, {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  getReference(): Promise<FuelReferencePrice[]> {
    return http<FuelReferencePrice[]>(`${BASE}/reference`);
  },
};
