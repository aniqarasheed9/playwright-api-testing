import { test, expect } from '@playwright/test';
import type { User } from '../test-data/types';
import { newUserPayload } from '../test-data/credentials';

test.describe('Users API — CRUD', () => {
  test('GET /users returns a non-empty list of users', async ({ request }) => {
    const res = await request.get('/users');
    expect(res.status()).toBe(200);

    const users: User[] = await res.json();
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);
  });

  test('GET /users/:id returns a single user with expected shape', async ({ request }) => {
    const res = await request.get('/users/1');
    expect(res.status()).toBe(200);

    const user: User = await res.json();
    expect(user.id).toBe(1);
    expect(user.email).toContain('@');
    expect(user.address).toHaveProperty('geolocation');
  });

  test('POST /users creates a new user and returns its generated id', async ({ request }) => {
    const res = await request.post('/users', { data: newUserPayload });
    expect(res.status()).toBe(201);

    const created: Pick<User, 'id'> = await res.json();
    expect(created).toHaveProperty('id');
    expect(typeof created.id).toBe('number');
  });

  test('PUT /users/:id updates an existing user', async ({ request }) => {
    const update = { ...newUserPayload, username: 'updated_qauser' };
    const res = await request.put('/users/1', { data: update });
    expect(res.status()).toBe(200);

    const updated: User = await res.json();
    expect(updated.username).toBe('updated_qauser');
  });

  test('DELETE /users/:id removes a user', async ({ request }) => {
    const res = await request.delete('/users/1');
    expect(res.status()).toBe(200);

    const deleted: User = await res.json();
    expect(deleted.id).toBe(1);
  });
});
