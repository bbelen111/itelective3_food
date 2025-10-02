const clone = (item) => JSON.parse(JSON.stringify(item));

const defaultFoods = [
  {
    id: 1,
    name: 'Chicken Adobo',
    category: 'Main Dish',
    price: 180.0,
    spicy: false,
    description: 'Classic Filipino braised chicken with soy sauce, vinegar, and garlic.'
  },
  {
    id: 2,
    name: 'Sinigang na Baboy',
    category: 'Soup',
    price: 220.0,
    spicy: true,
    description: 'Tamarind-based pork soup with vegetables and a tangy kick.'
  },
  {
    id: 3,
    name: 'Halo-Halo',
    category: 'Dessert',
    price: 150.0,
    spicy: false,
    description: 'Shaved ice dessert with sweet beans, fruits, leche flan, and ice cream.'
  },
  {
    id: 4,
    name: 'Pancit Canton',
    category: 'Noodles',
    price: 130.0,
    spicy: false,
    description: 'Stir-fried egg noodles with vegetables, pork, and shrimp.'
  }
];

let foods = defaultFoods.map(clone);
let nextId = foods.length + 1;

const reset = () => {
  foods = defaultFoods.map(clone);
  nextId = foods.length + 1;
};

const listFoods = ({ category, search, maxPrice, spicy } = {}) => {
  return foods
    .filter((food) => {
      if (category && food.category.toLowerCase() !== category.toLowerCase()) {
        return false;
      }
      if (maxPrice !== undefined && food.price > maxPrice) {
        return false;
      }
      if (typeof spicy === 'boolean' && food.spicy !== spicy) {
        return false;
      }
      if (search) {
        const haystack = `${food.name} ${food.description}`.toLowerCase();
        if (!haystack.includes(search.toLowerCase())) {
          return false;
        }
      }
      return true;
    })
    .map(clone);
};

const findFoodById = (id) => clone(foods.find((food) => food.id === id) || null);

const createFood = ({ name, category, price, spicy = false, description = '' }) => {
  const newFood = {
    id: nextId++,
    name,
    category,
    price,
    spicy: Boolean(spicy),
    description
  };
  foods.push(newFood);
  return clone(newFood);
};

const getCategories = () => {
  const categories = new Set();
  foods.forEach((food) => categories.add(food.category));
  return Array.from(categories.values()).sort();
};

module.exports = {
  listFoods,
  findFoodById,
  createFood,
  getCategories,
  reset,
  _getAll: () => foods.map(clone)
};
