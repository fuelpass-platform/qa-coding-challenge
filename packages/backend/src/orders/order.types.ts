export type FuelType = 'JET_A1' | 'AVGAS';

export type OrderStatus =
  | 'Submitted'
  | 'Confirmed'
  | 'Expiring'
  | 'Expired'
  | 'Rejected';

export interface FuelOrder {
  id: number;
  airport: string; // ICAO code, e.g. EDDF
  aircraft: string; // tail number, e.g. D-AIMA
  fuelType: FuelType;
  volumeGallons: number;
  pricePerGallon: number;
  total: number;
  status: OrderStatus;
  deliveryDate: string; // ISO date (requested delivery)
  created: string; // ISO datetime
}

export interface FuelReferencePrice {
  fuelType: FuelType;
  label: string;
  pricePerGallon: number;
  currency: 'USD';
}

export const AIRPORTS = [
  { icao: 'EDDF', name: 'Frankfurt' },
  { icao: 'EGLL', name: 'London Heathrow' },
  { icao: 'KJFK', name: 'New York JFK' },
  { icao: 'LFPG', name: 'Paris CDG' },
  { icao: 'OMDB', name: 'Dubai Intl' },
];

// Quoted to a tenth of a cent, as jet fuel commonly is.
export const REFERENCE_PRICES: FuelReferencePrice[] = [
  { fuelType: 'JET_A1', label: 'Jet A-1', pricePerGallon: 6.275, currency: 'USD' },
  { fuelType: 'AVGAS', label: 'Avgas 100LL', pricePerGallon: 7.415, currency: 'USD' },
];
