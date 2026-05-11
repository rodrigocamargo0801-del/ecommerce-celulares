const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy');

// Processar pagamento com Stripe
async function procesarPagamento(amount, paymentMethodId, description) {
    try {
        // Para desenvolvimento, simular sucesso
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('dummy')) {
            console.log('[STRIPE] Pagamento simulado de R$', amount);
            return {
                success: true,
                id: `pi_${Date.now()}`,
                status: 'succeeded',
                amount: amount,
                simulado: true
            };
        }

        // Pagamento real com Stripe
        const paymentIntent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100), // Converter para centavos
            currency: 'brl',
            payment_method: paymentMethodId,
            confirm: true,
            description: description
        });

        return {
            success: paymentIntent.status === 'succeeded',
            id: paymentIntent.id,
            status: paymentIntent.status,
            amount: amount
        };
    } catch (error) {
        console.error('[STRIPE] Erro:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

// Criar payment intent
async function criarPaymentIntent(amount, metadata = {}) {
    try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('dummy')) {
            return {
                id: `pi_${Date.now()}`,
                client_secret: `pi_${Date.now()}_secret_${Date.now()}`,
                simulado: true
            };
        }

        const intent = await stripe.paymentIntents.create({
            amount: Math.round(amount * 100),
            currency: 'brl',
            metadata
        });

        return {
            id: intent.id,
            client_secret: intent.client_secret
        };
    } catch (error) {
        console.error('[STRIPE] Erro ao criar intent:', error.message);
        throw error;
    }
}

// Reembolsar pagamento
async function reembolsar(paymentIntentId, amount = null) {
    try {
        if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.includes('dummy')) {
            console.log('[STRIPE] Reembolso simulado:', paymentIntentId);
            return { success: true, simulado: true };
        }

        const refund = await stripe.refunds.create({
            payment_intent: paymentIntentId,
            amount: amount ? Math.round(amount * 100) : undefined
        });

        return {
            success: true,
            id: refund.id
        };
    } catch (error) {
        console.error('[STRIPE] Erro ao reembolsar:', error.message);
        return {
            success: false,
            error: error.message
        };
    }
}

module.exports = {
    procesarPagamento,
    criarPaymentIntent,
    reembolsar
};
