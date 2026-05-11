const express = require('express');
const router = express.Router();
const { criarPedido, listarPedidos, obterPedido, atualizarStatusPedido, cancelarPedido } = require('../controllers/orderController');
const { autenticacao, ehAdmin } = require('../middleware/auth');
const { validarPedido } = require('../middleware/validation');

// POST /api/orders
router.post('/', autenticacao, validarPedido, criarPedido);

// GET /api/orders
router.get('/', autenticacao, listarPedidos);

// GET /api/orders/:id
router.get('/:id', autenticacao, obterPedido);

// PUT /api/orders/:id/status (Admin)
router.put('/:id/status', autenticacao, ehAdmin, atualizarStatusPedido);

// DELETE /api/orders/:id
router.delete('/:id', autenticacao, cancelarPedido);

module.exports = router;
