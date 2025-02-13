import express from 'express';
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();

// In-memory storage for users
export let users = [];

// Create a new user (Register)
router.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  // Validate required fields
  if (!username) {
    const error = 'Отсутствует обязательное поле: имя пользователя';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!email) {
    const error = 'Отсутствует обязательное поле: email';
    console.error(error);
    return res.status(400).json({ error });
  }
  if (!password) {
    const error = 'Отсутствует обязательное поле: пароль';
    console.error(error);
    return res.status(400).json({ error });
  }

  const user = {
    id: uuidv4(),
    username,
    email,
    password,
    adIds: [],
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  users.push(user);
  res.status(201).json(user);
});

// Login user
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  const user = users.find(u => u.email === email && u.password === password);
  if (user) {
    res.json({ userId: user.id, token: uuidv4() });
  } else {
    res.status(401).json({ error: 'Неверный email или пароль' });
  }
});

// Check if user exists
router.get('/check-user', (req, res) => {
  const userId = req.headers['user-id'];
  const user = users.find(u => u.id === userId);
  if (user) {
    res.json({ exists: true });
  } else {
    res.status(404).json({ exists: false });
  }
});

// Get all users
router.get('/', (req, res) => {
  if (users.length === 0) {
    const error = 'Пользователи не найдены';
    console.error(error);
    return res.status(404).json({ error });
  }
  res.json(users);
});

// Get user by id
router.get('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    res.json(user);
  } else {
    const error = 'Пользователь не найден';
    console.error(error);
    res.status(404).send(error);
  }
});

// Update user by id
router.put('/:id', (req, res) => {
  const user = users.find(u => u.id === req.params.id);
  if (user) {
    Object.assign(user, req.body, { updatedAt: new Date() });
    res.json(user);
  } else {
    const error = 'Пользователь не найден';
    console.error(error);
    res.status(404).send(error);
  }
});

// Delete user by id
router.delete('/:id', (req, res) => {
  const userIndex = users.findIndex(u => u.id === req.params.id);
  if (userIndex !== -1) {
    users.splice(userIndex, 1);
    res.status(204).send();
  } else {
    const error = 'Пользователь не найден';
    console.error(error);
    res.status(404).send(error);
  }
});

export default router;