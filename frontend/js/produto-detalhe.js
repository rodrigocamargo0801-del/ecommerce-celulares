// Detalhes do Produto

let produtoAtual = null;
let quantidadeSelecionada = 1;

document.addEventListener('DOMContentLoaded', () => {
    carregarProduto();
    produtosManager.atualizarContadorCarrinho();
});

async function carregarProduto() {
    try {
        const produtoId = obterParametroURL('id');

        if (!produtoId) {
            document.getElementById('produto-detalhes').innerHTML = '<div class="loading">Produto não encontrado</div>';
            return;
        }

        const response = await productAPI.getById(produtoId);
        produtoAtual = response.data;

        renderizarDetalhes();
    } catch (error) {
        console.error('Erro ao carregar produto:', error);
        document.getElementById('produto-detalhes').innerHTML = '<div class="loading">Erro ao carregar produto</div>';
    }
}

function renderizarDetalhes() {
    const container = document.getElementById('produto-detalhes');
    const precoDesconto = produtoAtual.desconto > 0
        ? `<div class="produto-desconto-grande">R$ ${produtoAtual.preco.toFixed(2)}</div>`
        : '';

    const precoFinal = produtoAtual.preco * (1 - produtoAtual.desconto / 100);

    const especsHtml = Object.entries(produtoAtual.especificacoes)
        .map(([chave, valor]) => `
            <div class="spec-item">
                <div class="spec-label">${formatarChave(chave)}</div>
                <div class="spec-valor">${valor}</div>
            </div>
        `).join('');

    const statusEstoque = produtoAtual.estoque > 0
        ? `<strong style="color: var(--success);">✓ Em estoque</strong> (${produtoAtual.estoque} unidades disponíveis)`
        : '<strong style="color: var(--danger);">✗ Fora de estoque</strong>';

    container.innerHTML = `
        <div class="produto-imagem-grande">
            <img src="${produtoAtual.imagem}" alt="${produtoAtual.nome}" onerror="this.src='/assets/images/placeholder.png'">
        </div>

        <div class="produto-detalhes">
            <div class="produto-marca">${produtoAtual.marca}</div>
            <h1>${produtoAtual.nome}</h1>

            <div class="produto-rating-grande">
                ★ ${produtoAtual.rating} / 5.0
            </div>

            ${precoDesconto}
            <div class="produto-preco-grande">R$ ${precoFinal.toFixed(2)}</div>

            <div class="produto-estoque-grande">
                ${statusEstoque}
            </div>

            <div class="descricao">
                <h3>Descrição</h3>
                <p>${produtoAtual.descricao || 'Produto de alta qualidade com excelentes especificações técnicas.'}</p>
            </div>

            <div class="especificacoes">
                <h3>Especificações Técnicas</h3>
                <div class="spec-grid">
                    ${especsHtml}
                </div>
            </div>

            <div class="quantidade-selector">
                <label for="quantidade">Quantidade:</label>
                <input type="number" id="quantidade" min="1" max="${produtoAtual.estoque}" value="1">
            </div>

            <div class="acoes">
                <button class="btn-comprar" id="btn-adicionar" ${produtoAtual.estoque <= 0 ? 'disabled' : ''}>
                    🛒 Adicionar ao Carrinho
                </button>
                <button class="btn-voltar" onclick="window.history.back()">← Voltar</button>
            </div>
        </div>
    `;

    // Atualizar breadcrumb
    document.getElementById('breadcrumb-produto').textContent = produtoAtual.nome;

    // Event listeners
    document.getElementById('quantidade').addEventListener('change', (e) => {
        quantidadeSelecionada = parseInt(e.target.value) || 1;
    });

    document.getElementById('btn-adicionar').addEventListener('click', adicionarAoCarrinho);
}

function adicionarAoCarrinho() {
    if (!produtoAtual) return;

    let carrinho = JSON.parse(localStorage.getItem('carrinho') || '[]');

    const itemExistente = carrinho.find(item => item.produto_id === produtoAtual.id);
    if (itemExistente) {
        itemExistente.quantidade += quantidadeSelecionada;
    } else {
        carrinho.push({
            produto_id: produtoAtual.id,
            nome: produtoAtual.nome,
            preco: produtoAtual.preco,
            desconto: produtoAtual.desconto,
            quantidade: quantidadeSelecionada,
            imagem: produtoAtual.imagem,
            marca: produtoAtual.marca
        });
    }

    localStorage.setItem('carrinho', JSON.stringify(carrinho));
    produtosManager.atualizarContadorCarrinho();

    alert(`${quantidadeSelecionada}x ${produtoAtual.nome} adicionado(s) ao carrinho!`);
}

function formatarChave(chave) {
    return chave
        .replace(/_/g, ' ')
        .split(' ')
        .map(palavra => palavra.charAt(0).toUpperCase() + palavra.slice(1))
        .join(' ');
}
