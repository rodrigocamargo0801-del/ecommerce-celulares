const express = require('express');
const router = express.Router();
const { listarUsuarios, obterUsuario, obterEstatisticas } = require('../controllers/userController');
const { autenticacao, ehAdmin } = require('../middleware/auth');

// GET /api/users/estatisticas
router.get('/estatisticas', autenticacao, ehAdmin, obterEstatisticas);

// GET /api/users
router.get('/', autenticacao, ehAdmin, listarUsuarios);

// GET /api/users/:id
router.get('/:id', autenticacao, ehAdmin, obterUsuario);

module.exports = router;
