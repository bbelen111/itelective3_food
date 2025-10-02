const path = require('path');
const express = require('express');
const cors = require('cors');

const foodRouter = require('./routes/foodRoutes');
const { getCategories } = require('./store/foodStore');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(path.join(__dirname, '..', 'public')));

app.use('/api/foods', foodRouter);

app.get('/api/categories', (req, res) => {
  const categories = getCategories();
  res.json({ categories });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Not found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error' });
});

module.exports = app;
