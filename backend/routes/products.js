const express = require('express');
const router = express.Router();
const { listarProdutos, obterProduto, criarProduto, atualizarProduto, deletarProduto } = require('../controllers/productController');
const { autenticacao, ehAdmin } = require('../middleware/auth');
const { validarProduto } = require('../middleware/validation');

// GET /api/products
router.get('/', listarProdutos);

// GET /api/products/:id
router.get('/:id', obterProduto);

// POST /api/products (Admin)
router.post('/', autenticacao, ehAdmin, validarProduto, criarProduto);

// PUT /api/products/:id (Admin)
router.put('/:id', autenticacao, ehAdmin, atualizarProduto);

// DELETE /api/products/:id (Admin)
router.delete('/:id', autenticacao, ehAdmin, deletarProduto);

module.exports = router;
