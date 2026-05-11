const express = require('express');
const router = express.Router();
const { registrar, login, obterPerfil, atualizarPerfil } = require('../controllers/authController');
const { autenticacao } = require('../middleware/auth');
const { validarRegistro, validarLogin } = require('../middleware/validation');

// POST /api/auth/register
router.post('/register', validarRegistro, registrar);

// POST /api/auth/login
router.post('/login', validarLogin, login);

// GET /api/auth/perfil
router.get('/perfil', autenticacao, obterPerfil);

// PUT /api/auth/perfil
router.put('/perfil', autenticacao, atualizarPerfil);

module.exports = router;
