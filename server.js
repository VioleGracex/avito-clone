import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import adsRoutes from './src/routes/ads.js';
import usersRoutes from './src/routes/users.js';

const app = express();
app.use(bodyParser.json());
app.use(cors()); // Enable CORS

// Use the ads and users routes
app.use('/items', adsRoutes);
app.use('/users', usersRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});