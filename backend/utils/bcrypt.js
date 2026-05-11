const bcrypt = require('bcryptjs');

// Criptografar senha
async function hashPassword(password) {
    try {
        const salt = await bcrypt.genSalt(10);
        return await bcrypt.hash(password, salt);
    } catch (error) {
        throw new Error('Erro ao criptografar senha');
    }
}

// Comparar senha
async function comparePassword(password, hash) {
    try {
        return await bcrypt.compare(password, hash);
    } catch (error) {
        return false;
    }
}

module.exports = {
    hashPassword,
    comparePassword
};
