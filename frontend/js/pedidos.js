// Página de Pedidos

document.addEventListener('DOMContentLoaded', () => {
    if (!isLoggedIn()) {
        alert('Você precisa estar logado');
        window.location.href = 'login.html';
        return;
    }

    carregarPedidos();
    produtosManager.atualizarContadorCarrinho();
});

async function carregarPedidos() {
    const content = document.getElementById('pedidos-content');

    try {
        content.innerHTML = '<div class="loading">Carregando pedidos...</div>';

        const response = await orderAPI.getAll();
        const pedidos = response.data.pedidos || [];

        if (pedidos.length === 0) {
            content.innerHTML = `
                <div class="pedidos-vazio">
                    <p>📦 Você ainda não tem pedidos</p>
                    <a href="index.html" class="btn-primary">Continuar Comprando</a>
                </div>
            `;
            return;
        }

        // Renderizar pedidos
        const pedidosHtml = pedidos.map(pedido => `
            <div class="pedido-card" onclick="abrirDetalhes('${pedido.id}')">
                <div class="pedido-numero">Pedido #${pedido.id}</div>
                <div class="pedido-data">📅 ${formatarData(pedido.data)}</div>

                <div class="pedido-status status-${pedido.status}">
                    ${formatarStatus(pedido.status)}
                </div>

                <div>
                    <small style="color: var(--secondary);">
                        ${pedido.produtos_count} produto(s)
                    </small>
                </div>

                <div class="pedido-total">R$ ${pedido.total.toFixed(2)}</div>
            </div>
        `).join('');

        content.innerHTML = `<div class="pedidos-grid">${pedidosHtml}</div>`;
    } catch (error) {
        console.error('Erro ao carregar pedidos:', error);
        content.innerHTML = '<div class="loading" style="color: red;">Erro ao carregar pedidos</div>';
    }
}

async function abrirDetalhes(pedidoId) {
    try {
        const response = await orderAPI.getById(pedidoId);
        const pedido = response.data;

        const produtosHtml = pedido.produtos.map(p => `
            <tr>
                <td>${p.nome}</td>
                <td>${p.quantidade}</td>
                <td>R$ ${p.preco_unitario.toFixed(2)}</td>
                <td style="text-align: right;">R$ ${p.subtotal.toFixed(2)}</td>
            </tr>
        `).join('');

        const modal = `
            <div>
                <h3>Informações do Pedido</h3>
                <p><strong>Número:</strong> ${pedido.id}</p>
                <p><strong>Data:</strong> ${formatarData(pedido.data)}</p>
                <p><strong>Status:</strong> <span class="pedido-status status-${pedido.status}">${formatarStatus(pedido.status)}</span></p>

                <h3 style="margin-top: 1.5rem;">Produtos</h3>
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 1.5rem;">
                    <thead>
                        <tr style="border-bottom: 2px solid var(--border);">
                            <th style="text-align: left; padding: 0.5rem;">Produto</th>
                            <th style="text-align: center; padding: 0.5rem;">Qtd</th>
                            <th style="text-align: right; padding: 0.5rem;">Preço</th>
                            <th style="text-align: right; padding: 0.5rem;">Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${produtosHtml}
                    </tbody>
                </table>

                <div style="background: var(--light); padding: 1rem; border-radius: 4px; margin-bottom: 1.5rem;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Subtotal:</span>
                        <span>R$ ${pedido.subtotal.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <span>Frete:</span>
                        <span>R$ ${pedido.taxa_envio.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 1.1rem; border-top: 1px solid var(--border); padding-top: 0.5rem;">
                        <span>Total:</span>
                        <span>R$ ${pedido.total.toFixed(2)}</span>
                    </div>
                </div>

                <h3>Endereço de Entrega</h3>
                <p>
                    ${pedido.endereco_entrega.rua}, ${pedido.endereco_entrega.numero}<br>
                    ${pedido.endereco_entrega.complemento ? pedido.endereco_entrega.complemento + '<br>' : ''}
                    ${pedido.endereco_entrega.cidade} - ${pedido.endereco_entrega.estado}<br>
                    CEP: ${pedido.endereco_entrega.cep}
                </p>

                <h3>Pagamento</h3>
                <p>
                    <strong>Método:</strong> ${formatarMetodo(pedido.pagamento.metodo)}<br>
                    <strong>Status:</strong> <span style="color: var(--success); font-weight: 600;">✓ Pago</span>
                </p>

                ${pedido.observacoes ? `
                    <h3>Observações</h3>
                    <p>${pedido.observacoes}</p>
                ` : ''}
            </div>
        `;

        document.getElementById('modal-body').innerHTML = modal;
        document.getElementById('modal').classList.add('active');
    } catch (error) {
        console.error('Erro ao carregar detalhes:', error);
        alert('Erro ao carregar detalhes do pedido');
    }
}

function fecharModal() {
    document.getElementById('modal').classList.remove('active');
}

function formatarStatus(status) {
    const statusTexto = {
        'pendente': '⏳ Pendente',
        'confirmado': '✓ Confirmado',
        'enviado': '📦 Enviado',
        'entregue': '✓ Entregue',
        'cancelado': '✗ Cancelado'
    };
    return statusTexto[status] || status;
}

function formatarMetodo(metodo) {
    const metodos = {
        'cartao': '💳 Cartão de Crédito',
        'pix': '🔗 PIX',
        'boleto': '📄 Boleto Bancário'
    };
    return metodos[metodo] || metodo;
}

function formatarData(data) {
    return new Date(data).toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    });
}
