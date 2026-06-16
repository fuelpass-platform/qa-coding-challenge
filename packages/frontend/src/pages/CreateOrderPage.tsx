import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Input,
  Select,
  SelectItem,
} from '@heroui/react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import type { FuelReferencePrice, FuelType } from '../api/types';
import { formatCurrency } from '../lib/format';

const AIRPORTS = [
  { icao: 'EDDF', name: 'Frankfurt' },
  { icao: 'EGLL', name: 'London Heathrow' },
  { icao: 'KJFK', name: 'New York JFK' },
  { icao: 'LFPG', name: 'Paris CDG' },
  { icao: 'OMDB', name: 'Dubai Intl' },
];

export function CreateOrderPage() {
  const navigate = useNavigate();
  const [reference, setReference] = useState<FuelReferencePrice[]>([]);
  const [airport, setAirport] = useState('EDDF');
  const [aircraft, setAircraft] = useState('');
  const [fuelType, setFuelType] = useState<FuelType>('JET_A1');
  const [volume, setVolume] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api.getReference().then(setReference);
  }, []);

  const pricePerGallon = useMemo(
    () => reference.find((r) => r.fuelType === fuelType)?.pricePerGallon ?? 0,
    [reference, fuelType],
  );

  const volumeNum = Number(volume);
  const liveTotal = volumeNum * pricePerGallon;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const created = await api.createOrder({
        airport,
        aircraft,
        fuelType,
        volumeGallons: volumeNum,
        deliveryDate,
      });
      navigate(`/orders/${created.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setSubmitting(false);
    }
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-3xl font-semibold text-fuelpass-500">
        New fuel order
      </h1>
      <p className="mt-1 text-sm text-[color:var(--text-secondary)]">
        Book fuel for an aircraft. Price per gallon is set from the live
        reference table.
      </p>

      <Card className="mt-6" shadow="sm">
        <CardHeader className="text-lg font-medium text-fuelpass-500">
          Order details
        </CardHeader>
        <CardBody>
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
            <Select
              label="Airport"
              selectedKeys={[airport]}
              onSelectionChange={(keys) =>
                setAirport(String(Array.from(keys)[0]))
              }
            >
              {AIRPORTS.map((a) => (
                <SelectItem key={a.icao}>{`${a.icao} — ${a.name}`}</SelectItem>
              ))}
            </Select>

            <Input
              data-testid="aircraft-input"
              placeholder="Aircraft tail number"
              value={aircraft}
              onValueChange={setAircraft}
            />

            <Select
              label="Fuel type"
              selectedKeys={[fuelType]}
              onSelectionChange={(keys) =>
                setFuelType(Array.from(keys)[0] as FuelType)
              }
            >
              {[
                { key: 'JET_A1', label: 'Jet A-1' },
                { key: 'AVGAS', label: 'Avgas 100LL' },
              ].map((f) => (
                <SelectItem key={f.key}>{f.label}</SelectItem>
              ))}
            </Select>

            <Input
              data-testid="volume-input"
              type="number"
              label="Volume (US gallons)"
              placeholder="0"
              value={volume}
              onValueChange={setVolume}
            />

            <Input
              type="date"
              label="Requested delivery date"
              value={deliveryDate}
              onValueChange={setDeliveryDate}
            />

            <div className="flex items-center justify-between rounded-medium bg-default-100 px-4 py-3">
              <span className="text-sm text-[color:var(--text-secondary)]">
                Estimated total
              </span>
              <span
                data-testid="live-total"
                className="text-lg font-semibold text-fuelpass-500"
              >
                {formatCurrency(Number.isFinite(liveTotal) ? liveTotal : 0)}
              </span>
            </div>

            {error && (
              <p className="text-sm text-danger" role="alert">
                {error}
              </p>
            )}

            <Button
              type="submit"
              data-testid="submit-order"
              isLoading={submitting}
              className="bg-fuelpass-500 font-semibold text-white"
            >
              Submit order
            </Button>
          </form>
        </CardBody>
      </Card>
    </section>
  );
}
