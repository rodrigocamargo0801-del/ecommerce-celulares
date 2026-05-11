// Script Principal - Inicialização

document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando aplicação...');

    // Inicializar página
    inicializarPagina();

    // Configurar event listeners
    configurarEventListeners();

    // Atualizar carrinho
    produtosManager.atualizarContadorCarrinho();
});

// ==================== INICIALIZAÇÃO ====================

function inicializarPagina() {
    // Carregar produtos apenas na home
    if (document.getElementById('produtos-grid')) {
        produtosManager.carregarProdutos();
    }

    // Verificar autenticação
    atualizarStatusAutenticacao();
}

// ==================== EVENT LISTENERS ====================

function configurarEventListeners() {
    // Busca
    const searchInput = document.getElementById('search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            produtosManager.filtrosAtivos.busca = e.target.value;
            produtosManager.aplicarFiltros();
        });
    }

    // Marca
    const marcaSelect = document.getElementById('marca');
    if (marcaSelect) {
        marcaSelect.addEventListener('change', (e) => {
            produtosManager.filtrosAtivos.marca = e.target.value;
            produtosManager.aplicarFiltros();
        });
    }

    // Ordenação
    const ordenarSelect = document.getElementById('ordenar');
    if (ordenarSelect) {
        ordenarSelect.addEventListener('change', (e) => {
            produtosManager.filtrosAtivos.ordenar = e.target.value;
            produtosManager.aplicarFiltros();
        });
    }
}

// ==================== AUTENTICAÇÃO ====================

function atualizarStatusAutenticacao() {
    const user = getCurrentUser();
    const loginLink = document.querySelector('nav a[href="login.html"]');

    if (loginLink) {
        if (user) {
            loginLink.textContent = `👤 ${user.nome}`;
            loginLink.href = '#';
            loginLink.addEventListener('click', (e) => {
                e.preventDefault();
                mostrarMenuUsuario(user);
            });
        } else {
            loginLink.textContent = 'Login';
            loginLink.href = 'login.html';
        }
    }
}

function mostrarMenuUsuario(user) {
    const opcoes = [
        `Bem-vindo, ${user.nome}!`,
        user.tipo === 'admin' ? 'Ir para Admin' : 'Meus Pedidos',
        'Logout'
    ];

    const escolha = prompt(opcoes.join('\n'));

    if (user.tipo === 'admin' && escolha === opcoes[1]) {
        window.location.href = 'admin.html';
    } else if (user.tipo === 'cliente' && escolha === opcoes[1]) {
        window.location.href = 'pedidos.html';
    } else if (escolha === opcoes[2]) {
        authAPI.logout();
        window.location.href = 'index.html';
    }
}

// ==================== UTILITÁRIOS ====================

// Formatar moeda
function formatarMoeda(valor) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    }).format(valor);
}

// Formatar data
function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
    });
}

// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar senha
function validarSenha(senha) {
    return senha.length >= 8;
}

// Obter parâmetro da URL
function obterParametroURL(nome) {
    const params = new URLSearchParams(window.location.search);
    return params.get(nome);
}

// Log de debug
function debug(mensagem, dados = null) {
    if (console) {
        console.log(`[DEBUG] ${mensagem}`, dados);
    }
}

// ==================== VERIFICAÇÕES INICIAIS ====================

// Verificar conexão com API
async function verificarConexaoAPI() {
    try {
        const response = await axios.get('http://localhost:3000/health');
        console.log('✓ API conectada:', response.data);
        return true;
    } catch (error) {
        console.error('✗ Erro na conexão com API:', error.message);
        console.error('Certifique-se de que o backend está rodando em http://localhost:3000');
        return false;
    }
}

// Executar na inicialização
verificarConexaoAPI();

// Logout automático
window.addEventListener('beforeunload', () => {
    // Salvar estado antes de sair
});

console.log('Aplicação inicializada com sucesso!');
