import { test, expect } from '@playwright/test';
import type { LoginResponse } from '../test-data/types';
import {
  validCredentials,
  invalidCredentials,
  nonExistentUserCredentials,
} from '../test-data/credentials';

test.describe('Auth API — login flow', () => {
  test('POST /auth/login with valid credentials returns a JWT token', async ({ request }) => {
    const res = await request.post('/auth/login', { data: validCredentials });
    expect(res.status()).toBe(201);

    const body: LoginResponse = await res.json();
    expect(body).toHaveProperty('token');
    expect(typeof body.token).toBe('string');
    expect(body.token.split('.')).toHaveLength(3); // JWT has 3 dot-separated segments
  });

  test('issued token can be used as a Bearer token on an authenticated-style request', async ({ request }) => {
    const loginRes = await request.post('/auth/login', { data: validCredentials });
    const { token } = (await loginRes.json()) as LoginResponse;

    const res = await request.get('/users/1', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(res.status()).toBe(200);
  });

  test('POST /auth/login with wrong password is rejected', async ({ request }) => {
    const res = await request.post('/auth/login', { data: invalidCredentials });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /auth/login with non-existent username is rejected', async ({ request }) => {
    const res = await request.post('/auth/login', { data: nonExistentUserCredentials });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /auth/login with missing password field is rejected', async ({ request }) => {
    const res = await request.post('/auth/login', { data: { username: 'mor_2314' } });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });

  test('POST /auth/login with empty body is rejected', async ({ request }) => {
    const res = await request.post('/auth/login', { data: {} });
    expect(res.status()).toBeGreaterThanOrEqual(400);
  });
});
