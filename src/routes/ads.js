import express from 'express';
import slugify from 'slugify';
import { users } from './users.js'; // Assuming users are managed in a separate module

const router = express.Router();

const ItemTypes = {
  REAL_ESTATE: 'Недвижимость',
  AUTO: 'Авто',
  SERVICES: 'Услуги',
};

// In-memory storage for ads
let items = [];

const makeCounter = () => {
  let count = items.length; // Start the counter from the length of existing items
  return () => ++count;
};

const itemsIdCounter = makeCounter();

// Create a new ad
router.post('/', (req, res) => {
  const { name, description, location, type, userId, ...rest } = req.body;

  // Validate common required fields
  if (!name) {
    const error = 'Missing required field: name';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!description) {
    const error = 'Missing required field: description';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!location) {
    const error = 'Missing required field: location';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!type) {
    const error = 'Missing required field: type';
    console.error(error);
    return res.status(400).json({ error });
  }

  // Validate user ID
  const user = users.find(u => u.id === userId);
  if (!user) {
    const error = 'Invalid user ID';
    console.error(error);
    return res.status(400).json({ error });
  }

  switch (type) {
    case ItemTypes.REAL_ESTATE:
      if (!rest.propertyType) {
        const error = 'Missing required field for Real estate: propertyType';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.area) {
        const error = 'Missing required field for Real estate: area';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.rooms) {
        const error = 'Missing required field for Real estate: rooms';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.price) {
        const error = 'Missing required field for Real estate: price';
        console.error(error);
        return res.status(400).json({ error });
      }
      break;
    case ItemTypes.AUTO:
      if (!rest.brand) {
        const error = 'Missing required field for Auto: brand';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.model) {
        const error = 'Missing required field for Auto: model';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.year) {
        const error = 'Missing required field for Auto: year';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.mileage) {
        const error = 'Missing required field for Auto: mileage';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.price) {
        const error = 'Missing required field for Auto: price';
        console.error(error);
        return res.status(400).json({ error });
      }
      break;
    case ItemTypes.SERVICES:
      if (!rest.serviceType) {
        const error = 'Missing required field for Services: serviceType';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.experience) {
        const error = 'Missing required field for Services: experience';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.cost) {
        const error = 'Missing required field for Services: cost';
        console.error(error);
        return res.status(400).json({ error });
      }
      break;
    default:
      const error = 'Invalid type';
      console.error(error);
      return res.status(400).json({ error });
  }

  const slug = slugify(name, { lower: true });

  // Ensure ID is unique
  const id = itemsIdCounter();
  if (items.some(item => item.id === id)) {
    const error = 'ID already exists';
    console.error(error);
    return res.status(400).json({ error });
  }

  const item = {
    id,
    name,
    description,
    location,
    type,
    userId,
    createdAt: new Date(),
    updatedAt: new Date(),
    ...rest,
  };

  items.push(item);
  user.adIds.push(id); // Add ad ID to user's ad list
  res.status(201).json(item);
});

// Get all ads
router.get('/', (req, res) => {
  res.json(items);
});

// Get ad by id
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    const error = 'Item not found';
    console.error(error);
    res.status(404).send(error);
  }
});

// Update ad by id
router.put('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    Object.assign(item, req.body, { updatedAt: new Date() });
    res.json(item);
  } else {
    const error = 'Item not found';
    console.error(error);
    res.status(404).send(error);
  }
});

// Delete ad by id
router.delete('/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex !== -1) {
    const [deletedItem] = items.splice(itemIndex, 1);
    const user = users.find(u => u.id === deletedItem.userId);
    if (user) {
      user.adIds = user.adIds.filter(adId => adId !== deletedItem.id);
    }
    res.status(204).send();
  } else {
    const error = 'Item not found';
    console.error(error);
    res.status(404).send(error);
  }
});

export default router;