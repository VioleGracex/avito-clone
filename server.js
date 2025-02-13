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

// In-memory storage for ads
let items = [];

const makeCounter = () => {
  let count = items.length; // Start the counter from the length of existing items
  return () => ++count;
};

const itemsIdCounter = makeCounter();

// Create a new ad
app.post('/items', (req, res) => {
  const { name, description, location, type, ...rest } = req.body;

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
    ...rest,
  };

  items.push(item);
  res.status(201).json(item);
});

// Get all ads
app.get('/items', (req, res) => {
  res.json(items);
});

// Get ad by id
app.get('/items/:id', (req, res) => {
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
app.put('/items/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    Object.assign(item, req.body);
    res.json(item);
  } else {
    const error = 'Item not found';
    console.error(error);
    res.status(404).send(error);
  }
});

// Delete ad by id
app.delete('/items/:id', (req, res) => {
  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex !== -1) {
    items.splice(itemIndex, 1);
    res.status(204).send();
  } else {
    const error = 'Item not found';
    console.error(error);
    res.status(404).send(error);
  }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});