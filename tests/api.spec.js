// tests/api.spec.js

const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost:9000/api/asteroids';

test.describe('Asteroids API Endpoints', () => {
  test.beforeEach(async () => {
    await new Promise(resolve => setTimeout(resolve, 2000));
  });

  test('GET /favorites - should retrieve favorites list', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/favorites`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toBeInstanceOf(Array);
  });

  test('POST /favorites - should add an asteroid to favorites', async ({ request }) => {
    const newAsteroid = {
      asteroid_id: '3426410'
    };

    const response = await request.post(`${BASE_URL}/favorites`, {
      data: newAsteroid,
    });
    expect(response.status()).toBe(201);
    const data = await response.json();
    expect(data.message).toBe('Asteroid added to favorites.');
  });

  test('DELETE /favorites/:id - should delete a favorite asteroid', async ({ request }) => {
    const response = await request.delete(`${BASE_URL}/favorites/3426410`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.message).toBe('Asteroid removed from favorites.');
  });

  test('GET / - should fetch asteroids data from NASA API', async ({ request }) => {
    const response = await request.get(`${BASE_URL}/`, {
      params: {
        endpoint: 'feed',
        start_date: '2023-01-01',
        end_date: '2023-01-02',
      },
    });
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('near_earth_objects');
  });

  test('GET /:id - should fetch specific asteroid details', async ({ request }) => {
    const asteroidId = '3542519'; 
    const response = await request.get(`${BASE_URL}/${asteroidId}`);
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data).toHaveProperty('id', asteroidId);
  });

});
