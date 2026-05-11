// Validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Validar senha
function validarSenha(senha) {
    return senha && senha.length >= 8;
}

// Validar campos obrigatórios
function validarCamposObrigatorios(campos, dados) {
    for (const campo of campos) {
        if (!dados[campo] && dados[campo] !== 0) {
            return { valido: false, erro: `Campo '${campo}' é obrigatório` };
        }
    }
    return { valido: true };
}

// Validar registro
function validarRegistro(req, res, next) {
    const { nome, email, senha } = req.body;

    const validacao = validarCamposObrigatorios(['nome', 'email', 'senha'], { nome, email, senha });
    if (!validacao.valido) {
        return res.status(400).json({ erro: validacao.erro });
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ erro: 'Email inválido' });
    }

    if (!validarSenha(senha)) {
        return res.status(400).json({ erro: 'Senha deve ter no mínimo 8 caracteres' });
    }

    next();
}

// Validar login
function validarLogin(req, res, next) {
    const { email, senha } = req.body;

    const validacao = validarCamposObrigatorios(['email', 'senha'], { email, senha });
    if (!validacao.valido) {
        return res.status(400).json({ erro: validacao.erro });
    }

    if (!validarEmail(email)) {
        return res.status(400).json({ erro: 'Email ou senha inválidos' });
    }

    next();
}

// Validar produto
function validarProduto(req, res, next) {
    const { nome, marca, preco } = req.body;

    const validacao = validarCamposObrigatorios(['nome', 'marca', 'preco'], { nome, marca, preco });
    if (!validacao.valido) {
        return res.status(400).json({ erro: validacao.erro });
    }

    if (preco <= 0) {
        return res.status(400).json({ erro: 'Preço deve ser maior que 0' });
    }

    next();
}

// Validar pedido
function validarPedido(req, res, next) {
    const { produtos, endereco } = req.body;

    if (!produtos || !Array.isArray(produtos) || produtos.length === 0) {
        return res.status(400).json({ erro: 'Pedido deve conter pelo menos um produto' });
    }

    if (!endereco || !endereco.rua || !endereco.numero || !endereco.cidade || !endereco.estado || !endereco.cep) {
        return res.status(400).json({ erro: 'Endereço incompleto' });
    }

    next();
}

module.exports = {
    validarEmail,
    validarSenha,
    validarCamposObrigatorios,
    validarRegistro,
    validarLogin,
    validarProduto,
    validarPedido
};
