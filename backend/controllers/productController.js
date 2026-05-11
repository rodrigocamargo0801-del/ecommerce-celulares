const fs = require('fs');
const path = require('path');

const productsFile = path.join(__dirname, '../data/products.json');

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

// Listar produtos
function listarProdutos(req, res) {
    try {
        const { busca, marca, preco_max, ordenar, pagina = 1, limite = 12 } = req.query;

        let produtos = lerProdutos();

        // Filtrar por busca
        if (busca) {
            produtos = produtos.filter(p =>
                p.nome.toLowerCase().includes(busca.toLowerCase()) ||
                p.marca.toLowerCase().includes(busca.toLowerCase())
            );
        }

        // Filtrar por marca
        if (marca) {
            produtos = produtos.filter(p => p.marca === marca);
        }

        // Filtrar por preço máximo
        if (preco_max) {
            produtos = produtos.filter(p => p.preco <= parseFloat(preco_max));
        }

        // Ordenar
        switch(ordenar) {
            case 'preco_asc':
                produtos.sort((a, b) => a.preco - b.preco);
                break;
            case 'preco_desc':
                produtos.sort((a, b) => b.preco - a.preco);
                break;
            case 'popular':
                produtos.sort((a, b) => b.rating - a.rating);
                break;
        }

        // Paginação
        const total = produtos.length;
        const inicio = (pagina - 1) * limite;
        const fim = inicio + parseInt(limite);
        const produtosPaginados = produtos.slice(inicio, fim);

        res.json({
            total,
            pagina: parseInt(pagina),
            limite: parseInt(limite),
            total_paginas: Math.ceil(total / limite),
            products: produtosPaginados
        });
    } catch (error) {
        console.error('[PRODUCT] Erro ao listar:', error.message);
        res.status(500).json({ erro: 'Erro ao listar produtos' });
    }
}

// Obter produto por ID
function obterProduto(req, res) {
    try {
        const { id } = req.params;
        const produtos = lerProdutos();
        const produto = produtos.find(p => p.id === id);

        if (!produto) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        res.json(produto);
    } catch (error) {
        console.error('[PRODUCT] Erro ao obter:', error.message);
        res.status(500).json({ erro: 'Erro ao obter produto' });
    }
}

// Criar produto
function criarProduto(req, res) {
    try {
        const { nome, marca, preco, desconto, descricao, especificacoes, estoque, imagem } = req.body;

        const produtos = lerProdutos();

        // Verificar nome único
        if (produtos.find(p => p.nome === nome)) {
            return res.status(400).json({ erro: 'Produto com este nome já existe' });
        }

        const novoProduto = {
            id: `prod${Date.now()}`,
            nome,
            marca,
            preco: parseFloat(preco),
            desconto: parseFloat(desconto) || 0,
            descricao: descricao || '',
            especificacoes: especificacoes || {},
            estoque: parseInt(estoque) || 0,
            imagem: imagem || '/assets/images/placeholder.png',
            rating: 4.5,
            criado_em: new Date().toISOString()
        };

        produtos.push(novoProduto);
        salvarProdutos(produtos);

        res.status(201).json({
            mensagem: 'Produto criado com sucesso',
            produto: novoProduto
        });
    } catch (error) {
        console.error('[PRODUCT] Erro ao criar:', error.message);
        res.status(500).json({ erro: 'Erro ao criar produto' });
    }
}

// Atualizar produto
function atualizarProduto(req, res) {
    try {
        const { id } = req.params;
        const { nome, marca, preco, desconto, descricao, especificacoes, estoque, imagem, rating } = req.body;

        const produtos = lerProdutos();
        const produtoIndex = produtos.findIndex(p => p.id === id);

        if (produtoIndex === -1) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        // Atualizar campos
        if (nome) produtos[produtoIndex].nome = nome;
        if (marca) produtos[produtoIndex].marca = marca;
        if (preco) produtos[produtoIndex].preco = parseFloat(preco);
        if (desconto !== undefined) produtos[produtoIndex].desconto = parseFloat(desconto);
        if (descricao) produtos[produtoIndex].descricao = descricao;
        if (especificacoes) produtos[produtoIndex].especificacoes = { ...produtos[produtoIndex].especificacoes, ...especificacoes };
        if (estoque !== undefined) produtos[produtoIndex].estoque = parseInt(estoque);
        if (imagem) produtos[produtoIndex].imagem = imagem;
        if (rating) produtos[produtoIndex].rating = parseFloat(rating);

        salvarProdutos(produtos);

        res.json({
            mensagem: 'Produto atualizado com sucesso',
            produto: produtos[produtoIndex]
        });
    } catch (error) {
        console.error('[PRODUCT] Erro ao atualizar:', error.message);
        res.status(500).json({ erro: 'Erro ao atualizar produto' });
    }
}

// Deletar produto
function deletarProduto(req, res) {
    try {
        const { id } = req.params;
        const produtos = lerProdutos();
        const produtoIndex = produtos.findIndex(p => p.id === id);

        if (produtoIndex === -1) {
            return res.status(404).json({ erro: 'Produto não encontrado' });
        }

        const produtoDeletado = produtos.splice(produtoIndex, 1);
        salvarProdutos(produtos);

        res.json({
            mensagem: 'Produto deletado com sucesso',
            produto: produtoDeletado[0]
        });
    } catch (error) {
        console.error('[PRODUCT] Erro ao deletar:', error.message);
        res.status(500).json({ erro: 'Erro ao deletar produto' });
    }
}

module.exports = {
    listarProdutos,
    obterProduto,
    criarProduto,
    atualizarProduto,
    deletarProduto
};
