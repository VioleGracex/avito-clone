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

// Create a counter for unique item IDs
const makeCounter = () => {
  let count = items.length; // Start the counter from the length of existing items
  return () => ++count;
};

const itemsIdCounter = makeCounter();

// Create a new ad
router.post('/', (req, res) => {
  const { name, description, location, type, userId, ...rest } = req.body;

  // Validate common required fields
  if (!name || !description || !location || !type || !userId) {
    return res.status(400).json({ error: 'Отсутствуют обязательные поля' });
  }

  // Validate user ID
  const user = users.find(u => u.id === userId);
  if (!user) {
    return res.status(400).json({ error: 'Неверный ID пользователя' });
  }

  const slug = slugify(name, { lower: true });

  // Ensure ID is unique
  const id = itemsIdCounter();
  if (items.some(item => item.id === id)) {
    return res.status(400).json({ error: 'ID уже существует' });
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

// Get ads by user id
router.get('/user/:userId', (req, res) => {
  const userAds = items.filter(item => item.userId === req.params.userId);
  if (userAds.length > 0) {
    res.json({ ads: userAds });
  } else {
    res.json({ ads: [], message: 'Объявления не найдены' });
  }
});

// Get ad by id
router.get('/:id', (req, res) => {
  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    res.json(item);
  } else {
    res.status(404).send('Объявление не найдено');
  }
});

// Update ad by id
router.put('/:id', (req, res) => {
  const { userId, ...updateData } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Отсутствует ID пользователя' });
  }

  const item = items.find(i => i.id === parseInt(req.params.id));
  if (item) {
    if (item.userId !== userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }
    Object.assign(item, updateData, { updatedAt: new Date() });
    res.json(item);
  } else {
    res.status(404).send('Объявление не найдено');
  }
});

// Delete ad by id
router.delete('/:id', (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ error: 'Отсутствует ID пользователя' });
  }

  const itemIndex = items.findIndex(i => i.id === parseInt(req.params.id));
  if (itemIndex !== -1) {
    const [deletedItem] = items.splice(itemIndex, 1);
    if (deletedItem.userId !== userId) {
      return res.status(403).json({ error: 'Доступ запрещен' });
    }
    const user = users.find(u => u.id === deletedItem.userId);
    if (user) {
      user.adIds = user.adIds.filter(adId => adId !== deletedItem.id);
    }
    res.status(204).send();
  } else {
    res.status(404).send('Объявление не найдено');
  }
});

export default router;