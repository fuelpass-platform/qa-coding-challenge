import type { FuelType, OrderStatus } from '../api/types';

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

/** Human-readable date label (DD/MM/YYYY). */
export function formatDate(iso: string): string {
  const d = new Date(iso);
  const dd = String(d.getDate()).padStart(2, '0');
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const yyyy = d.getFullYear();
  return `${dd}/${mm}/${yyyy}`;
}

export const FUEL_LABEL: Record<FuelType, string> = {
  JET_A1: 'Jet A-1',
  AVGAS: 'Avgas 100LL',
};

/** Maps a status to a HeroUI semantic color. */
export const STATUS_COLOR: Record<
  OrderStatus,
  'primary' | 'success' | 'warning' | 'danger' | 'default'
> = {
  Submitted: 'primary',
  Confirmed: 'success',
  Expiring: 'warning',
  Expired: 'danger',
  Rejected: 'danger',
};

/** Raw color values for the status dot (matches design-system semantics). */
export const STATUS_DOT: Record<OrderStatus, string> = {
  Submitted: '#4168E9',
  Confirmed: '#17C964',
  Expiring: '#F5A524',
  Expired: '#F31260',
  Rejected: '#F31260',
};

export const STATUS_NEXT_ACTION: Record<OrderStatus, string> = {
  Submitted: 'Awaiting supplier confirmation.',
  Confirmed: 'Order confirmed — view confirmation.',
  Expiring: 'Price window closing — act before expiry.',
  Expired: 'Offer lapsed — re-request a quote.',
  Rejected: 'Order rejected — re-request a quote.',
};
