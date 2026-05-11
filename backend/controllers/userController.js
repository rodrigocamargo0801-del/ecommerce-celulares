const fs = require('fs');
const path = require('path');

const usersFile = path.join(__dirname, '../data/users.json');
const ordersFile = path.join(__dirname, '../data/orders.json');

// Ler usuários
function lerUsuarios() {
    try {
        const dados = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(dados).users;
    } catch (error) {
        return [];
    }
}

// Ler pedidos
function lerPedidos() {
    try {
        const dados = fs.readFileSync(ordersFile, 'utf-8');
        return JSON.parse(dados).orders;
    } catch (error) {
        return [];
    }
}

// Listar usuários
function listarUsuarios(req, res) {
    try {
        const { pagina = 1, limite = 20 } = req.query;

        let usuarios = lerUsuarios();

        // Paginação
        const total = usuarios.length;
        const inicio = (pagina - 1) * limite;
        const fim = inicio + parseInt(limite);
        const usuariosPaginados = usuarios.slice(inicio, fim);

        // Adicionar contagem de pedidos
        const pedidos = lerPedidos();
        const usuariosComPedidos = usuariosPaginados.map(u => ({
            id: u.id,
            nome: u.nome,
            email: u.email,
            tipo: u.tipo,
            telefone: u.telefone,
            criado_em: u.criado_em,
            pedidos_count: pedidos.filter(p => p.usuario_id === u.id).length
        }));

        res.json({
            total,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            total_paginas: Math.ceil(total / limite),
            usuarios: usuariosComPedidos
        });
    } catch (error) {
        console.error('[USER] Erro ao listar usuários:', error.message);
        res.status(500).json({ erro: 'Erro ao listar usuários' });
    }
}

// Obter detalhes do usuário
function obterUsuario(req, res) {
    try {
        const { id } = req.params;
        const usuarios = lerUsuarios();
        const usuario = usuarios.find(u => u.id === id);

        if (!usuario) {
            return res.status(404).json({ erro: 'Usuário não encontrado' });
        }

        // Obter pedidos do usuário
        const pedidos = lerPedidos();
        const pedidosUsuario = pedidos.filter(p => p.usuario_id === id);

        res.json({
            id: usuario.id,
            nome: usuario.nome,
            email: usuario.email,
            telefone: usuario.telefone,
            endereco: usuario.endereco,
            tipo: usuario.tipo,
            criado_em: usuario.criado_em,
            atualizado_em: usuario.atualizado_em,
            pedidos: pedidosUsuario.map(p => ({
                id: p.id,
                data: p.data,
                status: p.status,
                total: p.total,
                produtos_count: p.produtos.length
            })),
            total_gasto: pedidosUsuario.reduce((sum, p) => sum + p.total, 0)
        });
    } catch (error) {
        console.error('[USER] Erro ao obter usuário:', error.message);
        res.status(500).json({ erro: 'Erro ao obter usuário' });
    }
}

// Obter estatísticas
function obterEstatisticas(req, res) {
    try {
        const usuarios = lerUsuarios();
        const pedidos = lerPedidos();

        // Clientes
        const clientes = usuarios.filter(u => u.tipo === 'cliente').length;

        // Admins
        const admins = usuarios.filter(u => u.tipo === 'admin').length;

        // Pedidos
        const pedidosPendentes = pedidos.filter(p => p.status === 'pendente').length;
        const pedidosConfirmados = pedidos.filter(p => p.status === 'confirmado').length;
        const pedidosEnviados = pedidos.filter(p => p.status === 'enviado').length;
        const pedidosEntregues = pedidos.filter(p => p.status === 'entregue').length;
        const pedidosCancelados = pedidos.filter(p => p.status === 'cancelado').length;

        // Vendas
        const totalVendas = pedidos.reduce((sum, p) => sum + p.total, 0);
        const vendasMes = pedidos
            .filter(p => {
                const data = new Date(p.data);
                const agora = new Date();
                return data.getMonth() === agora.getMonth() && data.getFullYear() === agora.getFullYear();
            })
            .reduce((sum, p) => sum + p.total, 0);

        // Produtos mais vendidos
        const produtosVendidos = {};
        pedidos.forEach(p => {
            p.produtos.forEach(prod => {
                if (!produtosVendidos[prod.nome]) {
                    produtosVendidos[prod.nome] = { quantidade: 0, receita: 0 };
                }
                produtosVendidos[prod.nome].quantidade += prod.quantidade;
                produtosVendidos[prod.nome].receita += prod.subtotal;
            });
        });

        const produtosTopo = Object.entries(produtosVendidos)
            .map(([nome, dados]) => ({ nome, ...dados }))
            .sort((a, b) => b.quantidade - a.quantidade)
            .slice(0, 5);

        res.json({
            usuarios: {
                total: usuarios.length,
                clientes,
                admins
            },
            pedidos: {
                total: pedidos.length,
                pendente: pedidosPendentes,
                confirmado: pedidosConfirmados,
                enviado: pedidosEnviados,
                entregue: pedidosEntregues,
                cancelado: pedidosCancelados
            },
            vendas: {
                total: totalVendas,
                mes: vendasMes,
                media: pedidos.length > 0 ? totalVendas / pedidos.length : 0
            },
            produtos_topo: produtosTopo
        });
    } catch (error) {
        console.error('[USER] Erro ao obter estatísticas:', error.message);
        res.status(500).json({ erro: 'Erro ao obter estatísticas' });
    }
}

module.exports = {
    listarUsuarios,
    obterUsuario,
    obterEstatisticas
};
