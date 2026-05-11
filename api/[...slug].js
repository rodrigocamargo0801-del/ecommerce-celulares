const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  try {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    // Rota: /api/products
    if (req.url.includes('/api/products')) {
      const dataPath = path.join(process.cwd(), 'backend/data/products.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return res.status(200).json(data.products);
    }

    // Rota: /api/health
    if (req.url.includes('/api/health')) {
      return res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
    }

    // Rota: /api (raiz)
    if (req.url === '/api' || req.url === '/api/') {
      return res.status(200).json({
        mensagem: 'E-commerce Celulares API',
        versao: '1.0.0',
        endpoints: {
          health: '/api/health',
          products: '/api/products',
          auth: '/api/auth',
          orders: '/api/orders',
          users: '/api/users'
        }
      });
    }

    // Rota: /api/users (lista de usuários de teste)
    if (req.url.includes('/api/users')) {
      const dataPath = path.join(process.cwd(), 'backend/data/users.json');
      const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));
      return res.status(200).json(data.users);
    }

    // Padrão: 404
    res.status(404).json({ erro: 'Endpoint não encontrado' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ erro: 'Erro interno do servidor', message: error.message });
  }
}
