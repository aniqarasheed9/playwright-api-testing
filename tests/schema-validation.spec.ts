import { test, expect } from '@playwright/test';
import { validateSchema } from '../utils/validateSchema';
import {
  productSchema,
  productListSchema,
  loginResponseSchema,
  userSchema,
  cartSchema,
} from '../test-data/schemas';
import { validCredentials } from '../test-data/credentials';

test.describe('Response schema validation', () => {
  test('GET /products/1 matches the product schema', async ({ request }) => {
    const res = await request.get('/products/1');
    const body = await res.json();

    const { valid, errors } = validateSchema(body, productSchema);
    expect(valid, errors).toBe(true);
  });

  test('GET /products matches the product list schema', async ({ request }) => {
    const res = await request.get('/products');
    const body = await res.json();

    const { valid, errors } = validateSchema(body, productListSchema);
    expect(valid, errors).toBe(true);
  });

  test('POST /auth/login response matches the login schema', async ({ request }) => {
    const res = await request.post('/auth/login', { data: validCredentials });
    const body = await res.json();

    const { valid, errors } = validateSchema(body, loginResponseSchema);
    expect(valid, errors).toBe(true);
  });

  test('GET /users/1 matches the user schema', async ({ request }) => {
    const res = await request.get('/users/1');
    const body = await res.json();

    const { valid, errors } = validateSchema(body, userSchema);
    expect(valid, errors).toBe(true);
  });

  test('GET /carts/1 matches the cart schema', async ({ request }) => {
    const res = await request.get('/carts/1');
    const body = await res.json();

    const { valid, errors } = validateSchema(body, cartSchema);
    expect(valid, errors).toBe(true);
  });
});
