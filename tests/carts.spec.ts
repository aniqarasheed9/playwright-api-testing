import { test, expect } from '@playwright/test';
import type { Cart } from '../test-data/types';

test.describe('Carts API — CRUD', () => {
  test('GET /carts returns a non-empty list of carts', async ({ request }) => {
    const res = await request.get('/carts');
    expect(res.status()).toBe(200);

    const carts: Cart[] = await res.json();
    expect(Array.isArray(carts)).toBe(true);
    expect(carts.length).toBeGreaterThan(0);
  });

  test('GET /carts/:id returns a single cart with product entries', async ({ request }) => {
    const res = await request.get('/carts/1');
    expect(res.status()).toBe(200);

    const cart: Cart = await res.json();
    expect(cart.id).toBe(1);
    expect(Array.isArray(cart.products)).toBe(true);
    expect(cart.products.length).toBeGreaterThan(0);
    for (const entry of cart.products) {
      expect(entry).toHaveProperty('productId');
      expect(entry).toHaveProperty('quantity');
    }
  });

  test('GET /carts/user/:userId returns carts belonging to that user', async ({ request }) => {
    const res = await request.get('/carts/user/1');
    expect(res.status()).toBe(200);

    const carts: Cart[] = await res.json();
    for (const cart of carts) {
      expect(cart.userId).toBe(1);
    }
  });

  test('POST /carts creates a new cart for a user', async ({ request }) => {
    const payload = {
      userId: 1,
      date: new Date().toISOString(),
      products: [{ productId: 1, quantity: 2 }],
    };
    const res = await request.post('/carts', { data: payload });
    expect(res.status()).toBe(201);

    const created: Cart = await res.json();
    expect(created.userId).toBe(1);
    expect(created.products[0].productId).toBe(1);
  });

  test('PUT /carts/:id updates cart contents', async ({ request }) => {
    const payload = {
      userId: 1,
      date: new Date().toISOString(),
      products: [{ productId: 2, quantity: 5 }],
    };
    const res = await request.put('/carts/1', { data: payload });
    expect(res.status()).toBe(200);

    const updated: Cart = await res.json();
    expect(updated.products[0].quantity).toBe(5);
  });

  test('DELETE /carts/:id removes a cart', async ({ request }) => {
    const res = await request.delete('/carts/1');
    expect(res.status()).toBe(200);

    const deleted: Cart = await res.json();
    expect(deleted.id).toBe(1);
  });
});
