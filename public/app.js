const foodsList = document.querySelector('#foods-list');
const resultsCount = document.querySelector('#results-count');
const categorySelect = document.querySelector('#category-select');
const filterForm = document.querySelector('#filter-form');
const createForm = document.querySelector('#create-form');
const createStatus = document.querySelector('#create-status');
const healthStatus = document.querySelector('#health-status');
const resetButton = document.querySelector('#reset-button');

const buildQuery = (params) =>
  Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null && value !== '')
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&');

const fetchFoods = async (params = {}) => {
  const query = buildQuery(params);
  const url = query ? `/api/foods?${query}` : '/api/foods';
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch foods: ${response.statusText}`);
  }
  return response.json();
};

const renderFoods = (data) => {
  const { items } = data;
  foodsList.innerHTML = '';

  if (!items.length) {
    resultsCount.textContent = 'No foods match your filters yet.';
    return;
  }

  resultsCount.textContent = `${items.length} dish${items.length > 1 ? 'es' : ''} available`;
  items.forEach((item) => {
    const li = document.createElement('li');
    li.innerHTML = `
      <article>
        <header>
          <h3>${item.name}</h3>
          <span class="pill">${item.category}</span>
          ${item.spicy ? '<span class="pill pill--warn">Spicy</span>' : ''}
        </header>
        <p class="price">₱${item.price.toFixed(2)}</p>
        <p>${item.description || 'No description provided yet.'}</p>
      </article>
    `;
    foodsList.appendChild(li);
  });
};

const loadCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Unable to load categories');
  }
  const { categories } = await response.json();
  categorySelect.innerHTML = '<option value="">All</option>';
  categories.forEach((category) => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });
};

const syncHealth = async () => {
  try {
    const response = await fetch('/api/health');
    const payload = await response.json();
    healthStatus.textContent = `${payload.status} at ${new Date(payload.timestamp).toLocaleTimeString()}`;
  } catch (error) {
    healthStatus.textContent = 'offline';
  }
};

const toParams = (form) => {
  const formData = new FormData(form);
  const params = {};
  formData.forEach((value, key) => {
    if (form.elements[key]?.type === 'checkbox') {
      params[key] = form.elements[key].checked ? 'true' : '';
    } else {
      params[key] = value.trim();
    }
  });
  return params;
};

filterForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  try {
    const params = toParams(filterForm);
    if (!filterForm.spicy.checked) {
      delete params.spicy;
    }
    const data = await fetchFoods(params);
    renderFoods(data);
  } catch (error) {
    resultsCount.textContent = error.message;
    foodsList.innerHTML = '';
  }
});

resetButton.addEventListener('click', async () => {
  filterForm.reset();
  await hydrate();
});

createForm.addEventListener('submit', async (event) => {
  event.preventDefault();
  createStatus.hidden = true;
  const body = toParams(createForm);
  body.spicy = createForm.spicy.checked;
  body.price = Number(body.price);

  try {
    const response = await fetch('/api/foods', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const problem = await response.json();
      throw new Error(problem.error || 'Unable to create food');
    }

    const food = await response.json();
    createStatus.textContent = `Added ${food.name}!`;
    createStatus.className = 'form-status form-status--success';
    createForm.reset();
    createStatus.hidden = false;
    await hydrate();
  } catch (error) {
    createStatus.textContent = error.message;
    createStatus.className = 'form-status form-status--error';
    createStatus.hidden = false;
  }
});

const hydrate = async () => {
  try {
    const data = await fetchFoods();
    renderFoods(data);
  } catch (error) {
    resultsCount.textContent = error.message;
  }
};

const init = async () => {
  await Promise.allSettled([hydrate(), loadCategories(), syncHealth()]);
  setInterval(syncHealth, 1000 * 60);
};

init().catch((error) => console.error('Initialization failed', error));
