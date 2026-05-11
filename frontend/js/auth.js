// Autenticação Frontend

function alternarFormulario() {
    document.getElementById('login-form').classList.toggle('hidden-form');
    document.getElementById('register-form').classList.toggle('hidden-form');
    limparAlerta();
}

// Login
document.getElementById('form-login')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const email = document.getElementById('email-login').value;
    const senha = document.getElementById('senha-login').value;

    try {
        mostrarAlerta('Autenticando...', 'loading');

        const response = await authAPI.login(email, senha);
        const { id, nome, tipo, token } = response.data;

        // Salvar dados
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ id, nome, tipo, email }));

        mostrarAlerta(`Bem-vindo, ${nome}!`, 'success');

        // Redirecionar
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        const mensagem = error.response?.data?.erro || 'Erro ao fazer login';
        mostrarAlerta(mensagem, 'error');
    }
});

// Cadastro
document.getElementById('form-register')?.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nome = document.getElementById('nome-register').value;
    const email = document.getElementById('email-register').value;
    const telefone = document.getElementById('telefone-register').value;
    const senha = document.getElementById('senha-register').value;
    const senhaConfirm = document.getElementById('senha-confirm').value;

    // Validar
    if (senha !== senhaConfirm) {
        mostrarAlerta('As senhas não conferem', 'error');
        return;
    }

    if (senha.length < 8) {
        mostrarAlerta('Senha deve ter no mínimo 8 caracteres', 'error');
        return;
    }

    try {
        mostrarAlerta('Criando conta...', 'loading');

        const response = await authAPI.register(nome, email, senha, telefone);
        const { id, tipo, token } = response.data;

        // Salvar dados
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify({ id, nome, tipo, email }));

        mostrarAlerta('Conta criada com sucesso! Bem-vindo!', 'success');

        // Redirecionar
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 1500);
    } catch (error) {
        const mensagem = error.response?.data?.erro || 'Erro ao criar conta';
        mostrarAlerta(mensagem, 'error');
    }
});

// Mostrar alerta
function mostrarAlerta(mensagem, tipo = 'error') {
    const alertDiv = document.getElementById('alert');
    alertDiv.innerHTML = `<div class="alert ${tipo}">${mensagem}</div>`;
}

// Limpar alerta
function limparAlerta() {
    const alertDiv = document.getElementById('alert');
    alertDiv.innerHTML = '';
}

// Logout
function logout() {
    authAPI.logout();
    window.location.href = 'index.html';
}
