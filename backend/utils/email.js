const axios = require('axios');

const SENDGRID_API_KEY = process.env.SENDGRID_API_KEY;
const SENDGRID_FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL;

// Enviar email de confirmação de pedido
async function enviarConfirmacaoPedido(email, usuario, pedido) {
    if (!SENDGRID_API_KEY) {
        console.log('[EMAIL] SendGrid não configurado. Email simulado para:', email);
        return true;
    }

    try {
        const htmlContent = `
            <h2>Pedido Confirmado! 🎉</h2>
            <p>Olá ${usuario},</p>
            <p>Seu pedido foi confirmado com sucesso!</p>

            <h3>Detalhes do Pedido</h3>
            <p><strong>Número:</strong> ${pedido.id}</p>
            <p><strong>Data:</strong> ${new Date(pedido.data).toLocaleDateString('pt-BR')}</p>
            <p><strong>Total:</strong> R$ ${pedido.total.toFixed(2)}</p>

            <h3>Produtos</h3>
            <ul>
                ${pedido.produtos.map(p => `
                    <li>${p.nome} (x${p.quantidade}) - R$ ${(p.preco_unitario * p.quantidade).toFixed(2)}</li>
                `).join('')}
            </ul>

            <h3>Endereço de Entrega</h3>
            <p>
                ${pedido.endereco_entrega.rua}, ${pedido.endereco_entrega.numero}
                <br>${pedido.endereco_entrega.complemento ? pedido.endereco_entrega.complemento + '<br>' : ''}
                ${pedido.endereco_entrega.cidade} - ${pedido.endereco_entrega.estado}
                <br>CEP: ${pedido.endereco_entrega.cep}
            </p>

            <p>Você pode acompanhar seu pedido em: <a href="${process.env.FRONTEND_URL}/pedidos.html">Meus Pedidos</a></p>

            <p>Obrigado por comprar conosco!</p>
        `;

        const payload = {
            personalizations: [{
                to: [{ email }],
                subject: `Pedido Confirmado - ${pedido.id}`
            }],
            from: { email: SENDGRID_FROM_EMAIL },
            content: [{
                type: 'text/html',
                value: htmlContent
            }]
        };

        const response = await axios.post(
            'https://api.sendgrid.com/v3/mail/send',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('[EMAIL] Email de confirmação enviado para:', email);
        return true;
    } catch (error) {
        console.error('[EMAIL] Erro ao enviar email:', error.message);
        return false;
    }
}

// Enviar email de atualização de pedido
async function enviarAtualizacaoPedido(email, usuario, pedido, novoStatus) {
    if (!SENDGRID_API_KEY) {
        console.log('[EMAIL] Atualização simulada para:', email);
        return true;
    }

    const statusTexto = {
        'pendente': 'Aguardando confirmação',
        'confirmado': 'Pedido confirmado',
        'enviado': 'Saiu para entrega',
        'entregue': 'Entregue',
        'cancelado': 'Cancelado'
    };

    try {
        const htmlContent = `
            <h2>Atualização do Seu Pedido</h2>
            <p>Olá ${usuario},</p>
            <p>Seu pedido ${pedido.id} teve uma atualização!</p>

            <h3>Novo Status: <strong style="color: #007bff;">${statusTexto[novoStatus] || novoStatus}</strong></h3>

            <p>Data da atualização: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>

            <p><a href="${process.env.FRONTEND_URL}/pedidos.html">Ver detalhes do pedido</a></p>
        `;

        const payload = {
            personalizations: [{
                to: [{ email }],
                subject: `Pedido Atualizado - ${pedido.id}`
            }],
            from: { email: SENDGRID_FROM_EMAIL },
            content: [{
                type: 'text/html',
                value: htmlContent
            }]
        };

        await axios.post(
            'https://api.sendgrid.com/v3/mail/send',
            payload,
            {
                headers: {
                    'Authorization': `Bearer ${SENDGRID_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        console.log('[EMAIL] Email de atualização enviado para:', email);
        return true;
    } catch (error) {
        console.error('[EMAIL] Erro ao enviar email:', error.message);
        return false;
    }
}

module.exports = {
    enviarConfirmacaoPedido,
    enviarAtualizacaoPedido
};
