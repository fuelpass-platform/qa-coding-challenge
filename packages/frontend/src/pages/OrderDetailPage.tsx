import { Button, Card, CardBody, CardHeader, Chip, Spinner } from '@heroui/react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import type { FuelOrder } from '../api/types';
import {
  FUEL_LABEL,
  STATUS_COLOR,
  STATUS_NEXT_ACTION,
  formatCurrency,
  formatDate,
} from '../lib/format';

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between border-b border-default-200 py-3 last:border-none">
      <span className="text-sm text-[color:var(--text-secondary)]">{label}</span>
      <span className="text-sm font-semibold text-fuelpass-500">{value}</span>
    </div>
  );
}

export function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<FuelOrder | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    api
      .getOrder(Number(id))
      .then(setOrder)
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <Spinner label="Loading order…" />
      </div>
    );
  }

  if (notFound || !order) {
    return (
      <div className="flex flex-col items-start gap-4">
        <h1 className="text-2xl font-semibold text-fuelpass-500">
          Order not found
        </h1>
        <Button color="primary" onPress={() => navigate('/')}>
          Back to orders
        </Button>
      </div>
    );
  }

  return (
    <section className="max-w-2xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold text-fuelpass-500">
          Order #{order.id}
        </h1>
        <Chip color={STATUS_COLOR[order.status]} variant="flat">
          {order.status}
        </Chip>
      </div>
      <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
        {STATUS_NEXT_ACTION[order.status]}
      </p>

      <Card className="mt-6" shadow="sm">
        <CardHeader className="text-lg font-medium text-fuelpass-500">
          Fuel order summary
        </CardHeader>
        <CardBody>
          <Row label="Airport" value={order.airport} />
          <Row label="Aircraft" value={order.aircraft || '—'} />
          <Row label="Fuel type" value={FUEL_LABEL[order.fuelType]} />
          <Row label="Volume" value={`${order.volumeGallons} gal`} />
          <Row
            label="Price / gallon"
            value={formatCurrency(order.pricePerGallon)}
          />
          <Row label="Total" value={formatCurrency(order.total)} />
          <Row label="Requested delivery" value={formatDate(order.deliveryDate)} />
          <Row label="Created" value={formatDate(order.created)} />
        </CardBody>
      </Card>

      <Button className="mt-6" variant="bordered" onPress={() => navigate('/')}>
        Back to orders
      </Button>
    </section>
  );
}
