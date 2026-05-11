const fs = require('fs');
const path = require('path');
const { hashPassword, comparePassword } = require('../utils/bcrypt');
const { gerarToken } = require('../utils/jwt');

const usersFile = path.join(__dirname, '../data/users.json');

// Ler usuários
function lerUsuarios() {
    try {
        const dados = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(dados).users;
    } catch (error) {
        return [];
    }
}

// Salvar usuários
function salvarUsuarios(usuarios) {
    fs.writeFileSync(usersFile, JSON.stringify({ users: usuarios }, null, 2));
}

// Registrar novo usuário
async function registrar(req, res) {
    try {
        const { nome, email, senha, telefone } = req.body;

        const usuarios = lerUsuarios();

        // Verificar se email já existe
        if (usuarios.find(u => u.email === email)) {
            return res.status(400).json({ erro: 'Email já cadastrado' });
        }

        // Hash da senha
        const senhaHash = await hashPassword(senha);

        // Novo usuário
        const novoUsuario = {
            id: `user${Date.now()}`,
            nome,
            email,
            senha: senhaHash,
            telefone: telefone || '',
            endereco: {
                rua: '',
                numero: '',
                complemento: '',
                cidade: '',
                estado: '',
                cep: ''
            },
            tipo: 'cliente',
            criado_em: new Date().toISOString()
        };

        usuarios.push(novoUsuario);
        salvarUsuarios(usuarios);

        // Gerar token
        const token = gerarToken(novoUsuario);

        res.status(201).json({
            mensagem: 'Usuário cadastrado com sucesso',
            id: novoUsuario.id,
            nome: novoUsuario.nome,
            email: novoUsuario.email,
            tipo: novoUsuario.tipo,
            token
        });
    } catch (error) {
        console.error('[AUTH] Erro ao registrar:', error.message);
        res.status(500).json({ erro: 'Erro ao registrar usuário' });
    }
}

// Login
async function login(req, res) {
    try {
        const { email, senha } = req.body;

        const usuarios = lerUsuarios();
        const usuario = usuarios.find(u => u.email === email);

        if (!usuario) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

        // Comparar senha
        const senhaValida = await comparePassword(senha, usuario.senha);
        if (!senhaValida) {
            return res.status(401).json({ erro: 'Email ou senha inválidos' });
        }

        // Gerar token
        const token = gerarToken(usuario);

        res.json({
            mensagem: 'Login realizado com sucesso',
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            tipo: usuario.tipo,
            token
        });
    } catch (error) {
        console.error('[AUTH] Erro ao fazer login:', error.message);
        res.status(500).json({ erro: 'Erro ao fazer login' });
    }
}

// Obter perfil
function obterPerfil(req, res) {
    try {
        const usuarios = lerUsuarios();
        const usuario = usuarios.find(u => u.id === req.user.id);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            endereco: usuario.endereco,
            tipo: usuario.tipo
        });
    } catch (error) {
        console.error('[AUTH] Erro ao obter perfil:', error.message);
        res.status(500).json({ erro: 'Erro ao obter perfil' });
    }
}

// Atualizar perfil
async function atualizarPerfil(req, res) {
    try {
        const { nome, telefone, endereco } = req.body;

        const usuarios = lerUsuarios();
        const usuarioIndex = usuarios.findIndex(u => u.id === req.user.id);

        if (usuarioIndex === -1) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        // Atualizar dados
        if (nome) usuarios[usuarioIndex].nome = nome;
        if (telefone) usuarios[usuarioIndex].telefone = telefone;
        if (endereco) usuarios[usuarioIndex].endereco = { ...usuarios[usuarioIndex].endereco, ...endereco };

        usuarios[usuarioIndex].atualizado_em = new Date().toISOString();

        salvarUsuarios(usuarios);

        res.json({
            mensagem: 'Perfil atualizado com sucesso',
            usuario: {
                id: usuarios[usuarioIndex].id,
                nome: usuarios[usuarioIndex].nome,
                email: usuarios[usuarioIndex].email,
                telefone: usuarios[usuarioIndex].telefone,
                endereco: usuarios[usuarioIndex].endereco
            }
        });
    } catch (error) {
        console.error('[AUTH] Erro ao atualizar perfil:', error.message);
        res.status(500).json({ erro: 'Erro ao atualizar perfil' });
    }
}

module.exports = {
    registrar,
    login,
    obterPerfil,
    atualizarPerfil
};
