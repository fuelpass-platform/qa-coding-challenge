export type FuelType = 'JET_A1' | 'AVGAS';

export type OrderStatus =
  | 'Submitted'
  | 'Confirmed'
  | 'Expiring'
  | 'Expired'
  | 'Rejected';

export interface FuelOrder {
  id: number;
  airport: string;
  aircraft: string;
  fuelType: FuelType;
  volumeGallons: number;
  pricePerGallon: number;
  total: number;
  status: OrderStatus;
  deliveryDate: string;
  created: string;
}

export interface FuelReferencePrice {
  fuelType: FuelType;
  label: string;
  pricePerGallon: number;
  currency: 'USD';
}

export interface CreateOrderPayload {
  airport: string;
  aircraft: string;
  fuelType: FuelType;
  volumeGallons: number;
  deliveryDate: string;
}
