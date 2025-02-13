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
    const error = 'Отсутствует обязательное поле: имя';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!description) {
    const error = 'Отсутствует обязательное поле: описание';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!location) {
    const error = 'Отсутствует обязательное поле: местоположение';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!type) {
    const error = 'Отсутствует обязательное поле: тип';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!userId) {
    const error = 'Отсутствует обязательное поле: ID пользователя';
    console.error(error);
    return res.status(400).json({ error });
  }

  // Validate user ID
  console.log(userId);
  const user = users.find(u => u.id === userId);
  if (!user) {
    const error = 'Неверный ID пользователя';
    console.error(error);
    return res.status(400).json({ error });
  }

  switch (type) {
    case ItemTypes.REAL_ESTATE:
      if (!rest.propertyType) {
        const error = 'Отсутствует обязательное поле для недвижимости: тип недвижимости';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.area) {
        const error = 'Отсутствует обязательное поле для недвижимости: площадь';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.rooms) {
        const error = 'Отсутствует обязательное поле для недвижимости: количество комнат';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.price) {
        const error = 'Отсутствует обязательное поле для недвижимости: цена';
        console.error(error);
        return res.status(400).json({ error });
      }
      break;
    case ItemTypes.AUTO:
      if (!rest.brand) {
        const error = 'Отсутствует обязательное поле для авто: марка';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.model) {
        const error = 'Отсутствует обязательное поле для авто: модель';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.year) {
        const error = 'Отсутствует обязательное поле для авто: год';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.mileage) {
        const error = 'Отсутствует обязательное поле для авто: пробег';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.price) {
        const error = 'Отсутствует обязательное поле для авто: цена';
        console.error(error);
        return res.status(400).json({ error });
      }
      break;
    case ItemTypes.SERVICES:
      if (!rest.serviceType) {
        const error = 'Отсутствует обязательное поле для услуг: тип услуги';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.experience) {
        const error = 'Отсутствует обязательное поле для услуг: опыт';
        console.error(error);
        return res.status(400).json({ error });
      }
      if (!rest.cost) {
        const error = 'Отсутствует обязательное поле для услуг: стоимость';
        console.error(error);
        return res.status(400).json({ error });
      }
      break;
    default:
      const error = 'Неверный тип';
      console.error(error);
      return res.status(400).json({ error });
  }

  const slug = slugify(name, { lower: true });

  // Ensure ID is unique
  const id = itemsIdCounter();
  if (items.some(item => item.id === id)) {
    const error = 'ID уже существует';
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
    const error = 'Объявление не найдено';
    console.error(error);
    res.status(404).send(error);
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
    const error = 'Объявление не найдено';
    console.error(error);
    res.status(404).send(error);
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
    const error = 'Объявление не найдено';
    console.error(error);
    res.status(404).send(error);
  }
});

export default router;