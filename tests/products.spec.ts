import { test, expect } from '@playwright/test';
import type { Product } from '../test-data/types';
import { newProductPayload } from '../test-data/credentials';

test.describe('Products API — CRUD', () => {
  test('GET /products returns a non-empty list of products', async ({ request }) => {
    const res = await request.get('/products');
    expect(res.status()).toBe(200);

    const products: Product[] = await res.json();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThan(0);
  });

  test('GET /products/:id returns a single product with matching id', async ({ request }) => {
    const res = await request.get('/products/1');
    expect(res.status()).toBe(200);

    const product: Product = await res.json();
    expect(product.id).toBe(1);
    expect(typeof product.title).toBe('string');
    expect(product.price).toBeGreaterThan(0);
  });

  test('GET /products/categories returns the known category list', async ({ request }) => {
    const res = await request.get('/products/categories');
    expect(res.status()).toBe(200);

    const categories: string[] = await res.json();
    expect(categories).toContain('electronics');
    expect(categories).toContain("men's clothing");
  });

  test('GET /products/category/:category filters by category', async ({ request }) => {
    const res = await request.get("/products/category/jewelery");
    expect(res.status()).toBe(200);

    const products: Product[] = await res.json();
    expect(products.length).toBeGreaterThan(0);
    for (const product of products) {
      expect(product.category).toBe('jewelery');
    }
  });

  test('GET /products?limit=3 respects the limit query param', async ({ request }) => {
    const res = await request.get('/products?limit=3');
    expect(res.status()).toBe(200);

    const products: Product[] = await res.json();
    expect(products.length).toBe(3);
  });

  test('GET /products?sort=desc returns products sorted by descending id', async ({ request }) => {
    const res = await request.get('/products?sort=desc');
    expect(res.status()).toBe(200);

    const products: Product[] = await res.json();
    const ids = products.map((p) => p.id);
    const sortedDesc = [...ids].sort((a, b) => b - a);
    expect(ids).toEqual(sortedDesc);
  });

  test('POST /products creates a new product and echoes submitted fields', async ({ request }) => {
    const res = await request.post('/products', { data: newProductPayload });
    expect(res.status()).toBe(201);

    const created: Product = await res.json();
    expect(created).toHaveProperty('id');
    expect(created.title).toBe(newProductPayload.title);
    expect(created.price).toBe(newProductPayload.price);
  });

  test('PUT /products/:id updates an existing product', async ({ request }) => {
    const update = { ...newProductPayload, title: 'Updated QA Product' };
    const res = await request.put('/products/7', { data: update });
    expect(res.status()).toBe(200);

    const updated: Product = await res.json();
    expect(updated.title).toBe('Updated QA Product');
  });

  test('DELETE /products/:id removes a product', async ({ request }) => {
    const res = await request.delete('/products/7');
    expect(res.status()).toBe(200);

    const deleted: Product = await res.json();
    expect(deleted.id).toBe(7);
  });
});
