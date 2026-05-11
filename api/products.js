const fs = require('fs');
const path = require('path');

export default function handler(req, res) {
  try {
    const dataPath = path.join(process.cwd(), 'backend/data/products.json');
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf8'));

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    if (req.method === 'OPTIONS') {
      return res.status(200).end();
    }

    if (req.method === 'GET') {
      return res.status(200).json(data.products);
    }

    res.status(405).json({ erro: 'Método não permitido' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ erro: 'Erro ao buscar produtos' });
  }
}
