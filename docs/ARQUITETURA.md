# Arquitetura do Sistema

## Header
Visão geral da arquitetura do e-commerce. Sistema dividido em frontend (cliente) e backend (servidor) com comunicação via API REST.

---

## Main

### Diagrama Geral
```
┌─────────────────────────────────────────────────────────────┐
│                        CLIENTE (Browser)                     │
│                  Frontend - HTML/CSS/JS                      │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Pages: Catálogo, Produto, Carrinho, Checkout, Admin │  │
│  │  Storage: localStorage (carrinho, user token)         │  │
│  └──────────────────────────────────────────────────────┘  │
└──────────────────────┬──────────────────────────────────────┘
                       │
                   API REST (Axios)
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      SERVIDOR                               │
│                 Backend - Node.js/Express                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │  Routes: /api/auth, /api/products, /api/orders      │  │
│  │  Controllers: Lógica de negócio                      │  │
│  │  Middleware: Autenticação, Validação                │  │
│  │  Utils: JWT, bcrypt, Email, Pagamento              │  │
│  └──────────────────────────────────────────────────────┘  │
│                       │                                     │
│         ┌─────────────┼─────────────┐                      │
│         │             │             │                      │
│         ▼             ▼             ▼                      │
│    JSON Files   SendGrid API   Stripe API                 │
│    (Database)   (Email)        (Pagamento)                │
│                                                            │
└─────────────────────────────────────────────────────────────┘
```

### Fluxo de Dados

**1. Consultar Produtos**
```
Cliente → GET /api/products → Backend → JSON → Response
```

**2. Autenticação**
```
Cliente → POST /api/auth/login → Backend → Validar → JWT Token
```

**3. Criar Pedido**
```
Cliente → POST /api/orders → Backend → Validar → Stripe → SaveJSON → SendGrid → Response
```

### Componentes Principais

#### Frontend
- **index.html** - Home/Catálogo
- **produto.html** - Detalhes do celular
- **carrinho.html** - Carrinho de compras
- **checkout.html** - Finalizacao do pedido
- **admin.html** - Painel administrativo
- **login.html** - Autenticação

#### Backend
- **server.js** - Inicialização
- **routes/** - Endpoints da API
- **controllers/** - Lógica de negócio
- **middleware/** - Validação, autenticação
- **data/** - Arquivos JSON

#### Banco de Dados (JSON)
- **products.json** - Catálogo de celulares
- **users.json** - Usuários cadastrados
- **orders.json** - Pedidos realizados

---

## Footer

### Segurança
- Senhas criptografadas com bcrypt
- JWT para autenticação
- Validação em todas as rotas
- Variáveis sensíveis em .env

### Performance
- Carrinho no localStorage (offline)
- API sem estado (stateless)
- Cache de imagens
- Responsive design
