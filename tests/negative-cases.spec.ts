import { test, expect } from '@playwright/test';

test.describe('Negative & edge-case handling', () => {
  test('GET /products/:id with a non-existent id returns 200 with an empty body', async ({ request }) => {
    const res = await request.get('/products/999999');
    expect(res.status()).toBe(200);
    const text = await res.text();
    expect(text.trim()).toBe('');
  });

  test('GET /products/:id with a non-numeric id does not error out', async ({ request }) => {
    const res = await request.get('/products/abc');
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /users/:id with a non-existent id returns a graceful response', async ({ request }) => {
    const res = await request.get('/users/999999');
    expect(res.status()).toBeLessThan(500);
  });

  test('GET /carts/:id with a non-existent id returns a graceful response', async ({ request }) => {
    const res = await request.get('/carts/999999');
    expect(res.status()).toBeLessThan(500);
  });

  test('POST /products with missing required fields is still handled without a server error', async ({ request }) => {
    const res = await request.post('/products', { data: { title: 'Incomplete Product' } });
    expect(res.status()).toBeLessThan(500);
  });

  test('POST /products with wrong field types does not crash the server', async ({ request }) => {
    const res = await request.post('/products', {
      data: { title: 'Bad Price Product', price: 'not-a-number', description: 'x', category: 'x', image: 'x' },
    });
    expect(res.status()).toBeLessThan(500);
  });

  test('unsupported HTTP method on a collection route returns 404', async ({ request }) => {
    const res = await request.fetch('/products', { method: 'PATCH', data: {} });
    expect(res.status()).toBe(404);
  });

  test('requesting a completely unknown route returns 404', async ({ request }) => {
    const res = await request.get('/this-route-does-not-exist');
    expect(res.status()).toBe(404);
  });

  test('GET /products?limit=0 is ignored and the full list is returned', async ({ request }) => {
    const unfiltered = await (await request.get('/products')).json();
    const res = await request.get('/products?limit=0');
    expect(res.status()).toBe(200);
    const body = await res.json();
    expect(Array.isArray(body)).toBe(true);
    expect(body.length).toBe(unfiltered.length);
  });

  test('GET /products?limit=-1 is handled without a server error', async ({ request }) => {
    const res = await request.get('/products?limit=-1');
    expect(res.status()).toBeLessThan(500);
  });
});
