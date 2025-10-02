const request = require('supertest');
const app = require('../src/app');
const { reset, listFoods } = require('../src/store/foodStore');

describe('Food API', () => {
  beforeEach(() => reset());

  it('returns the default list of foods', async () => {
    const response = await request(app).get('/api/foods');

    expect(response.status).toBe(200);
    expect(response.body.count).toBeGreaterThan(0);
    expect(Array.isArray(response.body.items)).toBe(true);
  });

  it('filters foods by category', async () => {
    const category = listFoods()[0].category;
    const response = await request(app).get('/api/foods').query({ category });

    expect(response.status).toBe(200);
    expect(response.body.items.every((item) => item.category === category)).toBe(true);
  });

  it('rejects invalid price when creating', async () => {
    const response = await request(app).post('/api/foods').send({
      name: 'Invalid Dish',
      category: 'Test',
      price: -5
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toMatch(/price must be a non-negative number/);
  });

  it('creates a new food and returns it', async () => {
    const payload = {
      name: 'Bicol Express',
      category: 'Main Dish',
      price: 195,
      spicy: true,
      description: 'Creamy coconut-based stew with pork and chilies.'
    };

    const createResponse = await request(app).post('/api/foods').send(payload);

    expect(createResponse.status).toBe(201);
    expect(createResponse.body).toMatchObject({
      name: payload.name,
      category: payload.category,
      spicy: payload.spicy
    });

    const listResponse = await request(app).get('/api/foods');
    const created = listResponse.body.items.find((item) => item.name === payload.name);

    expect(created).toBeDefined();
    expect(created.price).toBe(payload.price);
  });
});
