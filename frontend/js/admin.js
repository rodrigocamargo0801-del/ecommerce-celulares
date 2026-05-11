// Painel Admin

let adminDados = {
    usuarios: [],
    produtos: [],
    pedidos: []
};

document.addEventListener('DOMContentLoaded', () => {
    // Verificar se é admin
    if (!isLoggedIn()) {
        window.location.href = 'login.html';
        return;
    }

    const user = getCurrentUser();
    if (user.tipo !== 'admin') {
        alert('Acesso restrito a administradores');
        window.location.href = 'index.html';
        return;
    }

    document.getElementById('admin-user').textContent = `Bem-vindo, ${user.nome}`;

    // Carregar dados
    carregarDashboard();
    carregarProdutos();
    carregarPedidos();
    carregarUsuarios();
});

// ==================== DASHBOARD ====================

async function carregarDashboard() {
    try {
        const response = await userAPI.getAll({ limite: 999 });
        const statsResponse = await axios.get('http://localhost:3000/api/users/estatisticas', {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
        });

        const stats = statsResponse.data;

        // Renderizar cards
        const statsHtml = `
            <div class="stat-card">
                <h3>Usuários</h3>
                <div class="stat-valor">${stats.usuarios.total}</div>
                <small>${stats.usuarios.clientes} clientes</small>
            </div>

            <div class="stat-card">
                <h3>Pedidos Total</h3>
                <div class="stat-valor">${stats.pedidos.total}</div>
                <small>${stats.pedidos.entregue} entregues</small>
            </div>

            <div class="stat-card">
                <h3>Vendas Total</h3>
                <div class="stat-valor">R$ ${stats.vendas.total.toFixed(2)}</div>
                <small>Mês: R$ ${stats.vendas.mes.toFixed(2)}</small>
            </div>

            <div class="stat-card">
                <h3>Pedidos Pendentes</h3>
                <div class="stat-valor" style="color: var(--danger);">${stats.pedidos.pendente + stats.pedidos.confirmado}</div>
                <small>${stats.pedidos.pendente} pendentes</small>
            </div>
        `;

        document.getElementById('stats-container').innerHTML = statsHtml;

        // Produtos top
        const topProdutosHtml = stats.produtos_topo.map(p => `
            <tr>
                <td><strong>${p.nome}</strong></td>
                <td>${p.quantidade}</td>
                <td>R$ ${p.receita.toFixed(2)}</td>
            </tr>
        `).join('');

        document.getElementById('top-produtos').innerHTML = topProdutosHtml || '<tr><td colspan="3" style="text-align: center;">Nenhuma venda ainda</td></tr>';
    } catch (error) {
        console.error('Erro ao carregar dashboard:', error);
    }
}

// ==================== PRODUTOS ====================

async function carregarProdutos() {
    try {
        const response = await productAPI.getAll({ limite: 999 });
        adminDados.produtos = response.data.products || response.data;

        const html = adminDados.produtos.map(p => `
            <tr>
                <td><strong>${p.nome}</strong></td>
                <td>${p.marca}</td>
                <td>R$ ${p.preco.toFixed(2)}</td>
                <td>
                    <span class="badge ${p.estoque > 0 ? 'badge-success' : 'badge-danger'}">
                        ${p.estoque}
                    </span>
                </td>
                <td>
                    <button class="btn-secondary" onclick="editarProduto('${p.id}')" style="padding: 0.25rem 0.5rem; margin-right: 0.5rem;">Editar</button>
                    <button class="btn-danger" onclick="deletarProduto('${p.id}')" style="padding: 0.25rem 0.5rem;">Deletar</button>
                </td>
            </tr>
        `).join('');

        document.getElementById('produtos-table').innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar produtos:', error);
    }
}

function mostrarFormProduto() {
    const container = document.getElementById('form-produto-container');
    container.style.display = 'block';
    container.innerHTML = `
        <div class="form-container">
            <h2>Novo Produto</h2>
            <form onsubmit="criarProduto(event)">
                <div class="form-group">
                    <label>Nome:</label>
                    <input type="text" id="prod-nome" required>
                </div>
                <div class="form-group">
                    <label>Marca:</label>
                    <input type="text" id="prod-marca" required>
                </div>
                <div class="form-group">
                    <label>Preço:</label>
                    <input type="number" id="prod-preco" step="0.01" required>
                </div>
                <div class="form-group">
                    <label>Desconto (%):</label>
                    <input type="number" id="prod-desconto" min="0" max="100" value="0">
                </div>
                <div class="form-group">
                    <label>Estoque:</label>
                    <input type="number" id="prod-estoque" required>
                </div>
                <div class="form-group">
                    <label>Descrição:</label>
                    <textarea id="prod-descricao"></textarea>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn-salvar">Criar Produto</button>
                    <button type="button" class="btn-cancelar" onclick="document.getElementById('form-produto-container').style.display='none'">Cancelar</button>
                </div>
            </form>
        </div>
    `;
}

async function criarProduto(e) {
    e.preventDefault();

    try {
        await productAPI.create({
            nome: document.getElementById('prod-nome').value,
            marca: document.getElementById('prod-marca').value,
            preco: parseFloat(document.getElementById('prod-preco').value),
            desconto: parseFloat(document.getElementById('prod-desconto').value),
            estoque: parseInt(document.getElementById('prod-estoque').value),
            descricao: document.getElementById('prod-descricao').value
        });

        alert('Produto criado com sucesso!');
        document.getElementById('form-produto-container').style.display = 'none';
        carregarProdutos();
    } catch (error) {
        alert('Erro ao criar produto');
    }
}

async function deletarProduto(produtoId) {
    if (!confirm('Tem certeza que deseja deletar este produto?')) return;

    try {
        await productAPI.delete(produtoId);
        alert('Produto deletado com sucesso!');
        carregarProdutos();
    } catch (error) {
        alert('Erro ao deletar produto');
    }
}

function editarProduto(produtoId) {
    alert('Funcionalidade de edição será implementada');
}

// ==================== PEDIDOS ====================

async function carregarPedidos() {
    try {
        const response = await orderAPI.getAll();
        adminDados.pedidos = response.data.pedidos || [];

        const html = adminDados.pedidos.map(p => `
            <tr>
                <td><strong>#${p.id}</strong></td>
                <td>${p.usuario_id}</td>
                <td>${formatarData(p.data)}</td>
                <td>
                    <span class="badge ${getClasseStatus(p.status)}">
                        ${formatarStatus(p.status)}
                    </span>
                </td>
                <td>R$ ${p.total.toFixed(2)}</td>
                <td>
                    <select onchange="atualizarStatusPedido('${p.id}', this.value)" style="padding: 0.25rem;">
                        <option value="">Atualizar Status</option>
                        <option value="pendente">Pendente</option>
                        <option value="confirmado">Confirmado</option>
                        <option value="enviado">Enviado</option>
                        <option value="entregue">Entregue</option>
                        <option value="cancelado">Cancelado</option>
                    </select>
                </td>
            </tr>
        `).join('');

        document.getElementById('pedidos-table').innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
    }
}

async function atualizarStatusPedido(pedidoId, novoStatus) {
    if (!novoStatus) return;

    try {
        await orderAPI.updateStatus(pedidoId, novoStatus);
        alert('Status atualizado com sucesso!');
        carregarPedidos();
    } catch (error) {
        alert('Erro ao atualizar status');
    }
}

// ==================== USUÁRIOS ====================

async function carregarUsuarios() {
    try {
        const response = await userAPI.getAll({ limite: 999 });
        adminDados.usuarios = response.data.usuarios || [];

        const html = adminDados.usuarios.map(u => `
            <tr>
                <td><strong>${u.nome}</strong></td>
                <td>${u.email}</td>
                <td><span class="badge ${u.tipo === 'admin' ? 'badge-warning' : 'badge-success'}">${u.tipo}</span></td>
                <td>${u.pedidos_count || 0}</td>
                <td>${formatarData(u.criado_em)}</td>
            </tr>
        `).join('');

        document.getElementById('usuarios-table').innerHTML = html;
    } catch (error) {
        console.error('Erro ao carregar usuários:', error);
    }
}

// ==================== UTILITÁRIOS ====================

function mostrarSeccao(seccao) {
    // Ocultar todas
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    // Mostrar selecionada
    document.getElementById(seccao).classList.add('active');

    // Atualizar nav
    document.querySelectorAll('.admin-nav a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');
}

function getClasseStatus(status) {
    const classes = {
        'pendente': 'badge-warning',
        'confirmado': 'badge-warning',
        'enviado': 'badge-warning',
        'entregue': 'badge-success',
        'cancelado': 'badge-danger'
    };
    return classes[status] || 'badge-success';
}

function formatarStatus(status) {
    const textos = {
        'pendente': '⏳ Pendente',
        'confirmado': '✓ Confirmado',
        'enviado': '📦 Enviado',
        'entregue': '✓ Entregue',
        'cancelado': '✗ Cancelado'
    };
    return textos[status] || status;
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR');
}
