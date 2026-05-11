// Checkout e Pagamento

let carrinhoCheckout = [];

document.addEventListener('DOMContentLoaded', () => {
    // Verificar autenticação
    if (!isLoggedIn()) {
        alert('Você precisa estar logado');
        window.location.href = 'login.html';
        return;
    }

    carregarCheckout();
    configurarEventos();
});

function carregarCheckout() {
    carrinhoCheckout = JSON.parse(localStorage.getItem('carrinho') || '[]');

    if (carrinhoCheckout.length === 0) {
        alert('Carrinho vazio');
        window.location.href = 'carrinho.html';
        return;
    }

    renderizarResumo();
    carregarDadosUsuario();
}

function renderizarResumo() {
    const subtotal = carrinhoCheckout.reduce((sum, item) => {
        const preco = item.preco * (1 - (item.desconto || 0) / 100);
        return sum + (preco * item.quantidade);
    }, 0);

    const frete = 50;
    const total = subtotal + frete;

    // Produtos
    const produtosHtml = carrinhoCheckout.map(item => {
        const preco = item.preco * (1 - (item.desconto || 0) / 100);
        return `
            <div class="resumo-produto">
                <strong>${item.nome}</strong>
                <p>Quantidade: ${item.quantidade}</p>
                <p>R$ ${(preco * item.quantidade).toFixed(2)}</p>
            </div>
        `;
    }).join('');

    document.getElementById('resumo-produtos').innerHTML = produtosHtml;
    document.getElementById('subtotal-resumo').textContent = `R$ ${subtotal.toFixed(2)}`;
    document.getElementById('frete-resumo').textContent = `R$ ${frete.toFixed(2)}`;
    document.getElementById('total-resumo').textContent = `R$ ${total.toFixed(2)}`;
}

function carregarDadosUsuario() {
    const usuario = getCurrentUser();
    if (usuario) {
        // Pré-preencher com dados do usuário se disponível
        // (Isso seria feito após implementar GET /api/auth/perfil)
    }
}

function configurarEventos() {
    // Mudar método de pagamento
    document.querySelectorAll('input[name="metodo"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            const cartaoDados = document.getElementById('cartao-dados');
            cartaoDados.style.display = e.target.value === 'cartao' ? 'block' : 'none';

            // Limpar validação
            document.getElementById('numero-cartao').value = '';
            document.getElementById('validade').value = '';
            document.getElementById('cvc').value = '';
            document.getElementById('titular').value = '';
        });
    });

    // Botão de pagamento
    document.getElementById('btn-pagar').addEventListener('click', processarPagamento);

    // Formatar inputs
    document.getElementById('numero-cartao')?.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\s/g, '');
        valor = valor.replace(/(\d{4})/g, '$1 ').trim();
        e.target.value = valor;
    });

    document.getElementById('validade')?.addEventListener('input', (e) => {
        let valor = e.target.value.replace(/\D/g, '');
        if (valor.length >= 2) {
            valor = valor.slice(0, 2) + '/' + valor.slice(2, 4);
        }
        e.target.value = valor;
    });

    document.getElementById('cvc')?.addEventListener('input', (e) => {
        e.target.value = e.target.value.replace(/\D/g, '').slice(0, 3);
    });
}

async function processarPagamento(e) {
    e.preventDefault();

    // Validar dados
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const cidade = document.getElementById('cidade').value;
    const estado = document.getElementById('estado').value;
    const cep = document.getElementById('cep').value;

    if (!rua || !numero || !cidade || !estado || !cep) {
        mostrarAlerta('Preencha todos os campos de endereço', 'error');
        return;
    }

    const metodo = document.querySelector('input[name="metodo"]:checked').value;

    // Validar cartão se necessário
    if (metodo === 'cartao') {
        const numero = document.getElementById('numero-cartao').value.replace(/\s/g, '');
        const validade = document.getElementById('validade').value;
        const cvc = document.getElementById('cvc').value;
        const titular = document.getElementById('titular').value;

        if (!numero || numero.length < 16 || !validade || !cvc || !titular) {
            mostrarAlerta('Dados do cartão inválidos', 'error');
            return;
        }
    }

    // Desabilitar botão
    const btnPagar = document.getElementById('btn-pagar');
    btnPagar.disabled = true;
    btnPagar.textContent = 'Processando...';

    try {
        mostrarAlerta('Processando pagamento...', 'info');

        // Preparar dados do pedido
        const pedido = {
            produtos: carrinhoCheckout.map(item => ({
                produto_id: item.produto_id,
                quantidade: item.quantidade
            })),
            endereco: {
                rua,
                numero,
                complemento: document.getElementById('complemento').value,
                cidade,
                estado,
                cep
            },
            pagamento: {
                metodo,
                token: metodo === 'cartao' ? 'tok_visa' : undefined,
                observacoes: document.getElementById('observacoes').value
            }
        };

        // Criar pedido
        const response = await orderAPI.create(pedido);
        const { pedido: novoPedido } = response.data;

        // Limpar carrinho
        localStorage.removeItem('carrinho');

        mostrarAlerta('Pedido criado com sucesso! Redirecionando...', 'success');

        // Redirecionar
        setTimeout(() => {
            window.location.href = `pedidos.html?id=${novoPedido.id}`;
        }, 2000);
    } catch (error) {
        const mensagem = error.response?.data?.erro || 'Erro ao processar pagamento';
        mostrarAlerta(mensagem, 'error');
        btnPagar.disabled = false;
        btnPagar.textContent = 'Confirmar e Pagar';
    }
}

function mostrarAlerta(mensagem, tipo = 'error') {
    const alertDiv = document.getElementById('alert');
    const classes = {
        'error': 'alert error',
        'success': 'alert success',
        'info': 'alert error'
    };
    alertDiv.innerHTML = `<div class="${classes[tipo] || 'alert error'}">${mensagem}</div>`;
}
