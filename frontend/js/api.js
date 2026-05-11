// Configuração da API
const API_BASE_URL = 'http://localhost:3000/api';

// Criar instância do axios
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor para adicionar token
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Interceptor para tratamento de erros
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login.html';
        }
        return Promise.reject(error);
    }
);

// ==================== AUTENTICAÇÃO ====================
const authAPI = {
    register: (nome, email, senha, telefone) =>
        api.post('/auth/register', { nome, email, senha, telefone }),

    login: (email, senha) =>
        api.post('/auth/login', { email, senha }),

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
};

// ==================== PRODUTOS ====================
const productAPI = {
    getAll: (params) =>
        api.get('/products', { params }),

    getById: (id) =>
        api.get(`/products/${id}`),

    create: (data) =>
        api.post('/products', data),

    update: (id, data) =>
        api.put(`/products/${id}`, data),

    delete: (id) =>
        api.delete(`/products/${id}`)
};

// ==================== PEDIDOS ====================
const orderAPI = {
    create: (data) =>
        api.post('/orders', data),

    getAll: () =>
        api.get('/orders'),

    getById: (id) =>
        api.get(`/orders/${id}`),

    updateStatus: (id, status) =>
        api.put(`/orders/${id}/status`, { status }),

    cancel: (id) =>
        api.delete(`/orders/${id}`)
};

// ==================== USUÁRIOS ====================
const userAPI = {
    getAll: (params) =>
        api.get('/users', { params }),

    getById: (id) =>
        api.get(`/users/${id}`)
};

// ==================== UTILITÁRIOS ====================

// Verificar se usuário está logado
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Obter usuário atual
function getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Verificar se é admin
function isAdmin() {
    const user = getCurrentUser();
    return user?.tipo === 'admin';
}

// Mostrar erro
function showError(message) {
    console.error(message);
    alert(message || 'Erro ao processar solicitação');
}

// Mostrar sucesso
function showSuccess(message) {
    console.log(message);
    alert(message || 'Operação realizada com sucesso');
}
