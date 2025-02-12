import express from 'express';
import bodyParser from 'body-parser';
import slugify from 'slugify';
import cors from 'cors';

const ItemTypes = {
  REAL_ESTATE: 'Недвижимость',
  AUTO: 'Авто',
  SERVICES: 'Услуги',
};

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

/* // In-memory storage for ads
let items = [
  {
    id: 1,
    slug: 'fake-ad-1',
    name: 'Fake Ad 1',
    description: 'This is a fake ad for testing purposes.',
    location: 'New York',
    type: ItemTypes.REAL_ESTATE,
    propertyType: 'Apartment',
    area: 1200,
    rooms: 3,
    price: 300000,
  },
  {
    id: 2,
    slug: 'fake-ad-2',
    name: 'Fake Ad 2',
    description: 'This is another fake ad for testing purposes.',
    location: 'San Francisco',
    type: ItemTypes.AUTO,
    brand: 'Toyota',
    model: 'Corolla',
    year: 2020,
    mileage: 15000,
    price: 300000,
  }
]; */

const makeCounter = () => {
  let count = items.length; // Start the counter from the length of existing items
  return () => ++count;
};

const itemsIdCounter = makeCounter();

// Create a new ad
app.post('/items', (req, res) => {
  const { name, description, location, type, ...rest } = req.body;

  // Validate common required fields
  if (!name || !description || !location || !type) {
    return res.status(400).json({ error: 'Missing required common fields' });
  }

  switch (type) {
    case ItemTypes.REAL_ESTATE:
      if (!rest.propertyType || !rest.area || !rest.rooms || !rest.price) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Real estate' });
      }
      break;
    case ItemTypes.AUTO:
      if (!rest.brand || !rest.model || !rest.year || !rest.mileage) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Auto' });
      }
      break;
    case ItemTypes.SERVICES:
      if (!rest.serviceType || !rest.experience || !rest.cost) {
        return res
          .status(400)
          .json({ error: 'Missing required fields for Services' });
      }
      break;
    default:
      return res.status(400).json({ error: 'Invalid type' });
  }

  const slug = slugify(name, { lower: true });

  // Ensure ID is unique
  const id = itemsIdCounter();
  if (items.some(item => item.id === id)) {
    return res.status(400).json({ error: 'ID already exists' });
  }

  const item = {
    id,
    slug,
    name,
    description,
    location,
    type,
    ...rest,
  };

  items.push(item);
  res.status(201).json(item);
});

// Get all ads
app.get('/items', (req, res) => {
  res.json(items);
});

// Get ad by slug
app.get('/items/:slug', (req, res) => {
  const item = items.find(i => i.slug === req.params.slug);
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Update ad by slug
app.put('/items/:slug', (req, res) => {
  const item = items.find(i => i.slug === req.params.slug);
  if (item) {
    Object.assign(item, req.body);
    res.json(item);
  } else {
    res.status(404).send('Item not found');
  }
});

// Delete ad by slug
app.delete('/items/:slug', (req, res) => {
  const itemIndex = items.findIndex(i => i.slug === req.params.slug);
  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    res.status(404).send('Item not found');
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});