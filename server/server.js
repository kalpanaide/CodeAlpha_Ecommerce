const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.log('MongoDB connection error:', err));


const app = express();

app.use(cors());
app.use(express.json());

const productRoutes = require('./routes/products');
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('E-commerce API is running');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const userRoutes = require('./routes/users');
app.use('/api/users', userRoutes);

const orderRoutes = require('./routes/orders');
app.use('/api/orders', orderRoutes);

const reviewRoutes = require('./routes/reviews');
app.use('/api/reviews', reviewRoutes);

const recommendationRoutes = require('./routes/recommendations');
app.use('/api/recommendations', recommendationRoutes);

const uploadRoutes = require('./routes/upload');
app.use('/api/upload', uploadRoutes);