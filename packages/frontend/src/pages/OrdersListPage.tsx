import {
  Select,
  SelectItem,
  Spinner,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { FuelOrder, OrderStatus } from '../api/types';
import { FUEL_LABEL, STATUS_DOT, formatDate } from '../lib/format';

const STATUS_OPTIONS: Array<{ key: string; label: string }> = [
  { key: 'all', label: 'All statuses' },
  { key: 'Submitted', label: 'Submitted' },
  { key: 'Confirmed', label: 'Confirmed' },
  { key: 'Expiring', label: 'Expiring' },
  { key: 'Expired', label: 'Expired' },
  { key: 'Rejected', label: 'Rejected' },
];

export function OrdersListPage() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<FuelOrder[]>([]);
  const [status, setStatus] = useState<string>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const query = status === 'all' ? undefined : (status as OrderStatus);
    api
      .listOrders(query)
      .then(setOrders)
      .finally(() => setLoading(false));
  }, [status]);

  // Newest orders first.
  const sorted = useMemo(
    () =>
      [...orders].sort((a, b) =>
        formatDate(b.created).localeCompare(formatDate(a.created)),
      ),
    [orders],
  );

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-fuelpass-500">
            Fuel orders
          </h1>
          <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
            Live fuel procurement orders, newest first.
          </p>
        </div>
        <Select
          aria-label="Filter by status"
          label="Status"
          selectedKeys={[status]}
          className="max-w-[200px]"
          onSelectionChange={(keys) => setStatus(String(Array.from(keys)[0]))}
        >
          {STATUS_OPTIONS.map((opt) => (
            <SelectItem key={opt.key}>{opt.label}</SelectItem>
          ))}
        </Select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <Spinner label="Loading orders…" />
        </div>
      ) : (
        <Table
          aria-label="Fuel orders"
          removeWrapper
          classNames={{ td: 'py-3' }}
        >
          <TableHeader>
            <TableColumn>ORDER</TableColumn>
            <TableColumn>AIRPORT</TableColumn>
            <TableColumn>AIRCRAFT</TableColumn>
            <TableColumn>FUEL</TableColumn>
            <TableColumn>VOLUME</TableColumn>
            <TableColumn>PRICE/GAL</TableColumn>
            <TableColumn>TOTAL</TableColumn>
            <TableColumn>STATUS</TableColumn>
            <TableColumn>CREATED</TableColumn>
          </TableHeader>
          <TableBody emptyContent="No orders match this filter.">
            {sorted.map((o) => (
              <TableRow
                key={o.id}
                className="cursor-pointer hover:bg-default-100"
                data-testid="order-row"
                onClick={() => navigate(`/orders/${o.id}`)}
              >
                <TableCell>#{o.id}</TableCell>
                <TableCell>{o.airport}</TableCell>
                <TableCell>{o.aircraft}</TableCell>
                <TableCell>{FUEL_LABEL[o.fuelType]}</TableCell>
                <TableCell>{o.volumeGallons} gal</TableCell>
                <TableCell data-testid="price-cell">{o.pricePerGallon}</TableCell>
                <TableCell data-testid="total-cell">{o.total}</TableCell>
                <TableCell>
                  <span
                    data-testid="status-dot"
                    className="inline-block h-3 w-3 rounded-full"
                    style={{ backgroundColor: STATUS_DOT[o.status] }}
                  />
                </TableCell>
                <TableCell>{formatDate(o.created)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </section>
  );
}
