// Gerenciador de Carrinho

class CarrinhoManager {
    constructor() {
        this.itens = [];
        this.frete = 50;
    }

    carregar() {
        this.itens = JSON.parse(localStorage.getItem('carrinho') || '[]');
        this.renderizar();
        this.atualizarResumo();
    }

    renderizar() {
        const container = document.getElementById('items-container');

        if (this.itens.length === 0) {
            container.innerHTML = `
                <div class="carrinho-vazio">
                    <p>🛒 Seu carrinho está vazio</p>
                    <a href="index.html" class="btn-primary">Ver Catálogo</a>
                </div>
            `;
            document.getElementById('btn-checkout').disabled = true;
            return;
        }

        document.getElementById('btn-checkout').disabled = false;

        container.innerHTML = this.itens.map((item, index) => {
            const precoFinal = item.preco * (1 - (item.desconto || 0) / 100);
            const total = precoFinal * item.quantidade;

            return `
                <div class="carrinho-item">
                    <div class="item-imagem">
                        <img src="${item.imagem}" alt="${item.nome}" onerror="this.src='/assets/images/placeholder.png'">
                    </div>
                    <div class="item-info">
                        <h4>${item.nome}</h4>
                        <span class="item-preco">R$ ${precoFinal.toFixed(2)}</span>
                    </div>
                    <div class="item-quantidade">
                        <button onclick="carrinhoManager.diminuirQuantidade(${index})">−</button>
                        <input type="number" value="${item.quantidade}" min="1" onchange="carrinhoManager.atualizarQuantidade(${index}, this.value)">
                        <button onclick="carrinhoManager.aumentarQuantidade(${index})">+</button>
                    </div>
                    <div class="item-total">R$ ${total.toFixed(2)}</div>
                    <button class="btn-remover" onclick="carrinhoManager.remover(${index})">✕ Remover</button>
                </div>
            `;
        }).join('');
    }

    atualizarResumo() {
        const subtotal = this.calcularSubtotal();
        const total = subtotal + this.frete;

        document.getElementById('subtotal').textContent = `R$ ${subtotal.toFixed(2)}`;
        document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;
    }

    calcularSubtotal() {
        return this.itens.reduce((sum, item) => {
            const precoFinal = item.preco * (1 - (item.desconto || 0) / 100);
            return sum + (precoFinal * item.quantidade);
        }, 0);
    }

    aumentarQuantidade(index) {
        if (this.itens[index]) {
            this.itens[index].quantidade++;
            this.salvar();
            this.renderizar();
            this.atualizarResumo();
        }
    }

    diminuirQuantidade(index) {
        if (this.itens[index]) {
            if (this.itens[index].quantidade > 1) {
                this.itens[index].quantidade--;
                this.salvar();
                this.renderizar();
                this.atualizarResumo();
            } else {
                this.remover(index);
            }
        }
    }

    atualizarQuantidade(index, novaQuantidade) {
        const quantidade = parseInt(novaQuantidade) || 1;
        if (quantidade > 0) {
            this.itens[index].quantidade = quantidade;
            this.salvar();
            this.renderizar();
            this.atualizarResumo();
        }
    }

    remover(index) {
        this.itens.splice(index, 1);
        this.salvar();
        this.renderizar();
        this.atualizarResumo();
        produtosManager.atualizarContadorCarrinho();
    }

    limpar() {
        this.itens = [];
        this.salvar();
    }

    salvar() {
        localStorage.setItem('carrinho', JSON.stringify(this.itens));
        produtosManager.atualizarContadorCarrinho();
    }

    obterTotal() {
        return this.calcularSubtotal() + this.frete;
    }
}

// Instância global
const carrinhoManager = new CarrinhoManager();

// Inicializar
document.addEventListener('DOMContentLoaded', () => {
    carrinhoManager.carregar();

    // Botão de checkout
    document.getElementById('btn-checkout').addEventListener('click', () => {
        if (!isLoggedIn()) {
            alert('Você precisa estar logado para finalizar a compra');
            window.location.href = 'login.html';
            return;
        }

        window.location.href = 'checkout.html';
    });
});
