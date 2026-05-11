// Gestão de Produtos

class ProdutosManager {
    constructor() {
        this.produtos = [];
        this.filtrados = [];
        this.filtrosAtivos = {
            busca: '',
            marca: '',
            ordenar: ''
        };
    }

    // Carregar todos os produtos
    async carregarProdutos() {
        try {
            console.log('🔄 Carregando produtos...');
            const response = await productAPI.getAll();
            console.log('✅ Resposta da API:', response.data);
            this.produtos = response.data.products || response.data;
            console.log('📦 Produtos carregados:', this.produtos.length);
            this.filtrados = [...this.produtos];
            this.renderizar();
            console.log('✨ Produtos renderizados');
        } catch (error) {
            console.error('❌ Erro ao carregar produtos:', error);
            this.mostrarErro('Erro ao carregar produtos: ' + error.message);
        }
    }

    // Aplicar filtros
    aplicarFiltros() {
        this.filtrados = this.produtos.filter(produto => {
            const matchBusca = produto.nome.toLowerCase().includes(this.filtrosAtivos.busca.toLowerCase()) ||
                             produto.marca.toLowerCase().includes(this.filtrosAtivos.busca.toLowerCase());

            const matchMarca = !this.filtrosAtivos.marca || produto.marca === this.filtrosAtivos.marca;

            return matchBusca && matchMarca;
        });

        this.aplicarOrdenacao();
        this.renderizar();
    }

    // Aplicar ordenação
    aplicarOrdenacao() {
        switch(this.filtrosAtivos.ordenar) {
            case 'preco_asc':
                this.filtrados.sort((a, b) => a.preco - b.preco);
                break;
            case 'preco_desc':
                this.filtrados.sort((a, b) => b.preco - a.preco);
                break;
            case 'popular':
                this.filtrados.sort((a, b) => b.rating - a.rating);
                break;
        }
    }

    // Renderizar produtos
    renderizar() {
        const grid = document.getElementById('produtos-grid');
        if (!grid) return;

        if (this.filtrados.length === 0) {
            grid.innerHTML = '<div class="loading">Nenhum produto encontrado</div>';
            return;
        }

        grid.innerHTML = this.filtrados.map(produto => this.criarCardProduto(produto)).join('');

        // Adicionar event listeners aos botões
        document.querySelectorAll('.btn-adicionar').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const produtoId = e.target.dataset.id;
                this.adicionarAoCarrinho(produtoId);
            });
        });

        // Adicionar event listeners aos cards
        document.querySelectorAll('.produto-card').forEach(card => {
            card.addEventListener('click', (e) => {
                if (e.target.classList.contains('btn-adicionar')) return;
                const produtoId = card.dataset.id;
                window.location.href = `produto.html?id=${produtoId}`;
            });
        });
    }

    // Criar HTML do card
    criarCardProduto(produto) {
        const precoDesconto = produto.desconto > 0
            ? `<span class="produto-desconto">R$ ${produto.preco.toFixed(2)}</span>`
            : '';

        const precoFinal = produto.preco * (1 - produto.desconto / 100);

        return `
            <div class="produto-card" data-id="${produto.id}">
                <div class="produto-imagem">
                    <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='/assets/images/placeholder.png'">
                </div>
                <div class="produto-info">
                    <div class="produto-marca">${produto.marca}</div>
                    <h3 class="produto-nome">${produto.nome}</h3>
                    ${precoDesconto}
                    <div class="produto-preco">R$ ${precoFinal.toFixed(2)}</div>
                    <div class="produto-rating">★ ${produto.rating}</div>
                    <div class="produto-estoque">
                        ${produto.estoque > 0 ? `${produto.estoque} em estoque` : 'Fora de estoque'}
                    </div>
                    <button
                        class="btn-adicionar"
                        data-id="${produto.id}"
                        ${produto.estoque <= 0 ? 'disabled' : ''}
                    >
                        🛒 Adicionar
                    </button>
                </div>
            </div>
        `;
    }

    // Adicionar ao carrinho
    adicionarAoCarrinho(produtoId) {
        const produto = this.produtos.find(p => p.id === produtoId);
        if (!produto) return;

        let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

        const itemExistente = carrinho.find(item => item.produto_id === produtoId);
        if (itemExistente) {
            itemExistente.quantidade += 1;
        } else {
            carrinho.push({
                produto_id: produto.id,
                nome: produto.nome,
                preco: produto.preco,
                desconto: produto.desconto,
                quantidade: 1,
                imagem: produto.imagem,
                marca: produto.marca
            });
        }

        localStorage.setItem('carrinho', JSON.stringify(carrinho));
        this.atualizarContadorCarrinho();
        alert(`${produto.nome} adicionado ao carrinho!`);
    }

    // Atualizar contador do carrinho
    atualizarContadorCarrinho() {
        const carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');
        const contador = carrinho.reduce((total, item) => total + item.quantidade, 0);

        const elementoContador = document.getElementById('cart-count');
        if (elementoContador) {
            elementoContador.textContent = contador;
        }
    }

    // Mostrar erro
    mostrarErro(mensagem) {
        const grid = document.getElementById('produtos-grid');
        if (grid) {
            grid.innerHTML = `<div class="loading" style="color: red;">${mensagem}</div>`;
        }
    }

    // Buscar produto por ID
    obterProduto(id) {
        return this.produtos.find(p => p.id === id);
    }
}

// Instância global
const produtosManager = new ProdutosManager();
