import { expect, test } from '@playwright/test';

type FuelOrder = {
  id: number;
  airport: string;
  aircraft: string;
  fuelType: 'JET_A1' | 'AVGAS';
  volumeGallons: number;
  pricePerGallon: number;
  total: number;
  status: string;
  deliveryDate: string;
  created: string;
};

test.describe('FuelPass API defect proof', () => {
  test('FP-001: order detail lookup should return the requested id', async ({ request }) => {
    const response = await request.get('/api/orders/1');
    expect(response.status()).toBe(200);
    const order = (await response.json()) as FuelOrder;

    expect(order.id).toBe(1);
  });

  test('FP-002: Submitted filter should only return Submitted orders', async ({ request }) => {
    const response = await request.get('/api/orders?status=Submitted');
    expect(response.status()).toBe(200);
    const orders = (await response.json()) as FuelOrder[];

    expect(orders.length).toBeGreaterThan(0);
    expect(orders.map((order) => order.status)).toEqual(
      expect.arrayContaining(['Submitted']),
    );
    expect(orders.every((order) => order.status === 'Submitted')).toBe(true);
  });

  test('FP-003: stored totals should round to the nearest cent', async ({ request }) => {
    const response = await request.get('/api/orders');
    expect(response.status()).toBe(200);
    const orders = (await response.json()) as FuelOrder[];
    const order = orders.find((candidate) => candidate.id === 1);
    expect(order).toBeTruthy();

    const expectedTotal =
      Math.round(order!.volumeGallons * order!.pricePerGallon * 100) / 100;
    expect(order!.total).toBe(expectedTotal);
  });

  test('FP-004: a submitted order should start in Submitted state', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        airport: 'EDDF',
        aircraft: 'D-TEST',
        fuelType: 'JET_A1',
        volumeGallons: 10,
        deliveryDate: '2026-07-01',
      },
    });
    expect(response.status()).toBe(201);
    const order = (await response.json()) as FuelOrder;

    expect(order.status).toBe('Submitted');
  });

  test('FP-005: API should reject negative fuel volume', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        airport: 'EDDF',
        aircraft: 'D-NEG',
        fuelType: 'JET_A1',
        volumeGallons: -10,
        deliveryDate: '2026-07-01',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('FP-006: API should require aircraft tail number', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        airport: 'EDDF',
        fuelType: 'JET_A1',
        volumeGallons: 10,
        deliveryDate: '2026-07-01',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('FP-007: API should reject unsupported airport codes', async ({ request }) => {
    const response = await request.post('/api/orders', {
      data: {
        airport: 'ZZZZ',
        aircraft: 'D-BAD',
        fuelType: 'JET_A1',
        volumeGallons: 10,
        deliveryDate: '2026-07-01',
      },
    });

    expect(response.status()).toBe(400);
  });

  test('FP-016: API should allow fetching newly created order by ID', async ({ request }) => {
    const createResponse = await request.post('/api/orders', {
      data: {
        airport: 'EDDF',
        aircraft: 'D-FETCH',
        fuelType: 'JET_A1',
        volumeGallons: 10,
        deliveryDate: '2026-07-01',
      },
    });
    expect(createResponse.status()).toBe(201);
    const createdOrder = (await createResponse.json()) as FuelOrder;

    const getResponse = await request.get(`/api/orders/${createdOrder.id}`);
    expect(getResponse.status()).toBe(200);
    const fetchedOrder = (await getResponse.json()) as FuelOrder;

    expect(fetchedOrder.id).toBe(createdOrder.id);
    expect(fetchedOrder.airport).toBe(createdOrder.airport);
    expect(fetchedOrder.aircraft).toBe(createdOrder.aircraft);
    expect(fetchedOrder.fuelType).toBe(createdOrder.fuelType);
    expect(fetchedOrder.volumeGallons).toBe(createdOrder.volumeGallons);
    expect(fetchedOrder.deliveryDate).toBe(createdOrder.deliveryDate);
  });

});
