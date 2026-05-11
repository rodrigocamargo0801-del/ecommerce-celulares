const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5500',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/users', require('./routes/users'));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Root
app.get('/', (req, res) => {
  res.json({
    mensagem: 'E-commerce Celulares API',
    versao: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      products: '/api/products',
      orders: '/api/orders',
      users: '/api/users'
    }
  });
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ erro: 'Endpoint não encontrado' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ erro: 'Erro interno do servidor' });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║   E-commerce Celulares - Backend      ║
║   Servidor rodando em porta ${PORT}   ║
║   http://localhost:${PORT}             ║
╚════════════════════════════════════════╝
  `);
});

module.exports = app;
