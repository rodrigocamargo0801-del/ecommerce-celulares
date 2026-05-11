const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5500',
    'http://localhost:3000',
    process.env.FRONTEND_URL || 'https://seu-dominio.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('../backend/routes/auth'));
app.use('/api/products', require('../backend/routes/products'));
app.use('/api/orders', require('../backend/routes/orders'));
app.use('/api/users', require('../backend/routes/users'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root
app.get('/api', (req, res) => {
  res.json({
    mensagem: 'E-commerce Celulares API',
    versao: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users'
    }
  });
});

// 404 Handler
app.use('/api/*', (req, res) => {
  res.status(404).json({ erro: 'Endpoint não encontrado' });
});

module.exports = app;
