const { verificarToken, extrairToken } = require('../utils/jwt');

// Middleware de autenticação
function autenticacao(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = extrairToken(authHeader);

    if (!token) {
        return res.status(401).json({ erro: 'Token não fornecido' });
    }

    const decoded = verificarToken(token);
    if (!decoded) {
        return res.status(401).json({ erro: 'Token inválido ou expirado' });
    }

    req.user = decoded;
    next();
}

// Middleware de autorização (admin)
function ehAdmin(req, res, next) {
    if (req.user.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Acesso restrito a administradores' });
    }
    next();
}

// Middleware de autorização (proprietário ou admin)
function ehProprietarioOuAdmin(req, res, next) {
    const usuarioId = req.params.usuarioId || req.body.usuarioId;
    if (req.user.id !== usuarioId && req.user.tipo !== 'admin') {
        return res.status(403).json({ erro: 'Permissão negada' });
    }
    next();
}

module.exports = {
    autenticacao,
    ehAdmin,
    ehProprietarioOuAdmin
};
