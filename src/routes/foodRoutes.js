const express = require('express');
const {
  listFoods,
  findFoodById,
  createFood
} = require('../store/foodStore');

const router = express.Router();

router.get('/', (req, res) => {
  const { category, maxPrice, q, spicy } = req.query;

  const filters = {
    category: category?.trim() || undefined,
    search: q?.trim() || undefined,
    maxPrice: maxPrice ? Number(maxPrice) : undefined,
    spicy: typeof spicy === 'string' ? spicy === 'true' : undefined
  };

  if (filters.maxPrice !== undefined && Number.isNaN(filters.maxPrice)) {
    return res.status(400).json({ error: 'maxPrice must be a number' });
  }

  const foods = listFoods(filters);
  res.json({ count: foods.length, items: foods });
});

router.get('/:id', (req, res) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id)) {
    return res.status(400).json({ error: 'id must be numeric' });
  }

  const food = findFoodById(id);

  if (!food) {
    return res.status(404).json({ error: 'Food not found' });
  }

  res.json(food);
});

router.post('/', (req, res) => {
  const { name, category, price, spicy = false } = req.body;

  if (!name || !category || price === undefined) {
    return res.status(400).json({ error: 'name, category, and price are required' });
  }

  const numericPrice = Number(price);
  if (Number.isNaN(numericPrice) || numericPrice < 0) {
    return res.status(400).json({ error: 'price must be a non-negative number' });
  }

  const isSpicy = typeof spicy === 'boolean' ? spicy : spicy === 'true';

  const newFood = createFood({ name, category, price: numericPrice, spicy: isSpicy });
  res.status(201).json(newFood);
});

module.exports = router;
