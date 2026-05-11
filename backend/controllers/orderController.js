const fs = require('fs');
const path = require('path');
const { procesarPagamento } = require('../utils/stripe');
const { enviarConfirmacaoPedido, enviarAtualizacaoPedido } = require('../utils/email');

const ordersFile = path.join(__dirname, '../data/orders.json');
const productsFile = path.join(__dirname, '../data/products.json');
const usersFile = path.join(__dirname, '../data/users.json');

// Ler pedidos
function lerPedidos() {
    try {
        const dados = fs.readFileSync(ordersFile, 'utf-8');
        return JSON.parse(dados).orders;
    } catch (error) {
        return [];
    }
}

// Salvar pedidos
function salvarPedidos(pedidos) {
    fs.writeFileSync(ordersFile, JSON.stringify({ orders: pedidos }, null, 2));
}

// Ler produtos
function lerProdutos() {
    try {
        const dados = fs.readFileSync(productsFile, 'utf-8');
        return JSON.parse(dados).products;
    } catch (error) {
        return [];
    }
}

// Salvar produtos
function salvarProdutos(produtos) {
    fs.writeFileSync(productsFile, JSON.stringify({ products: produtos }, null, 2));
}

// Ler usuários
function lerUsuarios() {
    try {
        const dados = fs.readFileSync(usersFile, 'utf-8');
        return JSON.parse(dados).users;
    } catch (error) {
        return [];
    }
}

// Criar pedido
async function criarPedido(req, res) {
    try {
        const { produtos, endereco, pagamento } = req.body;
        const usuarioId = req.user.id;

        // Verificar produtos e estoque
        const produtosDb = lerProdutos();
        let subtotal = 0;
        const produtosPedido = [];

        for (const item of produtos) {
            const produto = produtosDb.find(p => p.id === item.produto_id);

            if (!produto) {
                return res.status(404).json({ erro: `Produto ${item.produto_id} não encontrado` });
            }

            if (produto.estoque < item.quantidade) {
                return res.status(400).json({ erro: `Estoque insuficiente para ${produto.nome}` });
            }

            const precoFinal = produto.preco * (1 - produto.desconto / 100);
            produtosPedido.push({
                produto_id: produto.id,
                nome: produto.nome,
                preco_unitario: precoFinal,
                quantidade: item.quantidade,
                subtotal: precoFinal * item.quantidade
            });

            subtotal += precoFinal * item.quantidade;
        }

        // Calcular total
        const taxaEnvio = 50;
        const total = subtotal + taxaEnvio;

        // Processar pagamento
        const pagamentoResultado = await procesarPagamento(
            total,
            pagamento.token || 'simulado',
            `Pedido de ${req.user.nome}`
        );

        if (!pagamentoResultado.success) {
            return res.status(402).json({
                erro: 'Erro ao processar pagamento',
                detalhes: pagamentoResultado.error
            });
        }

        // Reduzir estoque
        for (const item of produtos) {
            const produtoIndex = produtosDb.findIndex(p => p.id === item.produto_id);
            produtosDb[produtoIndex].estoque -= item.quantidade;
        }
        salvarProdutos(produtosDb);

        // Criar pedido
        const novoPedido = {
            id: `order${Date.now()}`,
            usuario_id: usuarioId,
            data: new Date().toISOString(),
            status: 'confirmado',
            produtos: produtosPedido,
            subtotal,
            taxa_envio: taxaEnvio,
            total,
            pagamento: {
                metodo: pagamento.metodo || 'cartao',
                status: 'pago',
                stripe_id: pagamentoResultado.id,
                data_pagamento: new Date().toISOString()
            },
            endereco_entrega: endereco,
            email_enviado: false,
            observacoes: pagamento.observacoes || ''
        };

        // Salvar pedido
        const pedidos = lerPedidos();
        pedidos.push(novoPedido);
        salvarPedidos(pedidos);

        // Enviar email
        const usuarios = lerUsuarios();
        const usuario = usuarios.find(u => u.id === usuarioId);
        if (usuario) {
            await enviarConfirmacaoPedido(usuario.email, usuario.nome, novoPedido);
            novoPedido.email_enviado = true;
            salvarPedidos(pedidos);
        }

        res.status(201).json({
            mensagem: 'Pedido criado com sucesso',
            pedido: novoPedido
        });
    } catch (error) {
        console.error('[ORDER] Erro ao criar pedido:', error.message);
        res.status(500).json({ erro: 'Erro ao criar pedido' });
    }
}

// Listar pedidos do usuário
function listarPedidos(req, res) {
    try {
        const usuarioId = req.user.id;
        let pedidos = lerPedidos();

        // Filtrar por usuário
        if (req.user.tipo !== 'admin') {
            pedidos = pedidos.filter(p => p.usuario_id === usuarioId);
        }

        // Ordenar por data decrescente
        pedidos.sort((a, b) => new Date(b.data) - new Date(a.data));

        res.json({
            total: pedidos.length,
            pedidos: pedidos.map(p => ({
                id: p.id,
                data: p.data,
                status: p.status,
                total: p.total,
                produtos_count: p.produtos.length
            }))
        });
    } catch (error) {
        console.error('[ORDER] Erro ao listar pedidos:', error.message);
        res.status(500).json({ erro: 'Erro ao listar pedidos' });
    }
}

// Obter pedido por ID
function obterPedido(req, res) {
    try {
        const { id } = req.params;
        const pedidos = lerPedidos();
        const pedido = pedidos.find(p => p.id === id);

        if (!pedido) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }

        // Verificar permissão
        if (req.user.tipo !== 'admin' && pedido.usuario_id !== req.user.id) {
            return res.status(403).json({ erro: 'Permissão negada' });
        }

        res.json(pedido);
    } catch (error) {
        console.error('[ORDER] Erro ao obter pedido:', error.message);
        res.status(500).json({ erro: 'Erro ao obter pedido' });
    }
}

// Atualizar status do pedido
async function atualizarStatusPedido(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const pedidos = lerPedidos();
        const pedidoIndex = pedidos.findIndex(p => p.id === id);

        if (pedidoIndex === -1) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }

        const pedido = pedidos[pedidoIndex];
        const statusAnterior = pedido.status;
        pedido.status = status;

        salvarPedidos(pedidos);

        // Enviar email de atualização
        const usuarios = lerUsuarios();
        const usuario = usuarios.find(u => u.id === pedido.usuario_id);
        if (usuario) {
            await enviarAtualizacaoPedido(usuario.email, usuario.nome, pedido, status);
        }

        res.json({
            mensagem: 'Status do pedido atualizado',
            id: pedido.id,
            status_anterior: statusAnterior,
            status_novo: status,
            email_enviado: true
        });
    } catch (error) {
        console.error('[ORDER] Erro ao atualizar status:', error.message);
        res.status(500).json({ erro: 'Erro ao atualizar status' });
    }
}

// Cancelar pedido
function cancelarPedido(req, res) {
    try {
        const { id } = req.params;
        const pedidos = lerPedidos();
        const pedidoIndex = pedidos.findIndex(p => p.id === id);

        if (pedidoIndex === -1) {
            return res.status(404).json({ erro: 'Pedido não encontrado' });
        }

        const pedido = pedidos[pedidoIndex];

        // Verificar permissão
        if (req.user.tipo !== 'admin' && pedido.usuario_id !== req.user.id) {
            return res.status(403).json({ erro: 'Permissão negada' });
        }

        // Verificar se pode cancelar
        if (!['pendente', 'confirmado'].includes(pedido.status)) {
            return res.status(400).json({ erro: 'Pedido não pode ser cancelado neste status' });
        }

        // Devolver estoque
        const produtosDb = lerProdutos();
        for (const item of pedido.produtos) {
            const produtoIndex = produtosDb.findIndex(p => p.id === item.produto_id);
            if (produtoIndex !== -1) {
                produtosDb[produtoIndex].estoque += item.quantidade;
            }
        }
        salvarProdutos(produtosDb);

        // Atualizar status
        pedido.status = 'cancelado';
        salvarPedidos(pedidos);

        res.json({
            mensagem: 'Pedido cancelado com sucesso',
            pedido
        });
    } catch (error) {
        console.error('[ORDER] Erro ao cancelar pedido:', error.message);
        res.status(500).json({ erro: 'Erro ao cancelar pedido' });
    }
}

module.exports = {
    criarPedido,
    listarPedidos,
    obterPedido,
    atualizarStatusPedido,
    cancelarPedido
};
