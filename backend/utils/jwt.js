const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

// Gerar token
function gerarToken(user) {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            tipo: user.tipo
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRE }
    );
}

// Verificar token
function verificarToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        return null;
    }
}

// Extrair token do header
function extrairToken(header) {
    if (!header) return null;
    const partes = header.split(' ');
    return partes.length === 2 && partes[0] === 'Bearer' ? partes[1] : null;
}

module.exports = {
    gerarToken,
    verificarToken,
    extrairToken
};
