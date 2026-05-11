# Estrutura de Pastas do Projeto

## Header
Organização completa de diretórios e arquivos do projeto e-commerce. Dividido em frontend, backend e documentação.

---

## Main

### Estrutura Completa

```
projeto-ecommerce/
│
├── frontend/
│   ├── index.html                 # Home - Catálogo de produtos
│   ├── produto.html               # Detalhes do celular
│   ├── carrinho.html              # Carrinho de compras
│   ├── checkout.html              # Checkout e pagamento
│   ├── pedidos.html               # Histórico de pedidos
│   ├── login.html                 # Login/Cadastro
│   ├── admin.html                 # Painel administrativo
│   │
│   ├── css/
│   │   ├── styles.css             # Estilos globais
│   │   ├── responsive.css         # Media queries
│   │   ├── admin.css              # Estilos do admin
│   │   └── components.css         # Componentes reutilizáveis
│   │
│   ├── js/
│   │   ├── api.js                 # Chamadas à API (axios)
│   │   ├── auth.js                # Autenticação e tokens
│   │   ├── carrinho.js            # Lógica do carrinho
│   │   ├── produtos.js            # Listagem de produtos
│   │   ├── checkout.js            # Processamento de pagamento
│   │   ├── admin.js               # Gerenciamento admin
│   │   ├── utils.js               # Funções utilitárias
│   │   └── main.js                # Inicialização
│   │
│   └── assets/
│       ├── images/                # Imagens dos celulares
│       │   ├── samsung/
│       │   ├── iphone/
│       │   ├── xiaomi/
│       │   └── logo.png
│       └── icons/                 # Ícones
│
├── backend/
│   ├── package.json               # Dependências Node.js
│   ├── .env.example               # Variáveis de ambiente (exemplo)
│   ├── server.js                  # Inicialização Express
│   │
│   ├── routes/
│   │   ├── auth.js                # Rotas de autenticação
│   │   ├── products.js            # Rotas de produtos
│   │   ├── orders.js              # Rotas de pedidos
│   │   └── users.js               # Rotas de usuários
│   │
│   ├── controllers/
│   │   ├── authController.js      # Lógica de autenticação
│   │   ├── productController.js   # Lógica de produtos
│   │   ├── orderController.js     # Lógica de pedidos
│   │   └── userController.js      # Lógica de usuários
│   │
│   ├── middleware/
│   │   ├── auth.js                # Verificação de JWT
│   │   ├── validation.js          # Validação de dados
│   │   └── errorHandler.js        # Tratamento de erros
│   │
│   ├── utils/
│   │   ├── jwt.js                 # Funções JWT
│   │   ├── bcrypt.js              # Hash de senhas
│   │   ├── email.js               # SendGrid integration
│   │   ├── stripe.js              # Stripe integration
│   │   └── logger.js              # Log de eventos
│   │
│   └── data/
│       ├── products.json          # Catálogo de produtos
│       ├── users.json             # Usuários cadastrados
│       └── orders.json            # Pedidos realizados
│
├── docs/
│   ├── ARQUITETURA.md             # Arquitetura do sistema
│   ├── ESTRUTURA_PASTAS.md        # Este arquivo
│   ├── SCHEMA_BANCO.md            # Schema JSON
│   ├── FUNCIONALIDADES.md         # Features detalhadas
│   ├── FLUXOS.md                  # Fluxos de negócio
│   ├── API_ENDPOINTS.md           # Documentação de API
│   └── SETUP.md                   # Instruções de setup
│
├── .gitignore
├── README.md                      # Documentação geral
└── CLAUDE.md                      # Instruções do projeto
```

### Descrição de Pastas

#### Frontend/
- **Arquivos HTML** - Páginas da aplicação
- **CSS/** - Estilos responsivos
- **JS/** - JavaScript para interatividade e API
- **Assets/** - Imagens e ícones dos celulares

#### Backend/
- **Routes/** - Definição dos endpoints
- **Controllers/** - Lógica de negócio separada
- **Middleware/** - Autenticação e validação
- **Utils/** - Funções reutilizáveis
- **Data/** - Arquivos JSON como banco de dados

#### Docs/
- Documentação completa do projeto
- Guias de setup e deployment

---

## Footer

### Convenções de Nomenclatura
- **Pastas:** snake_case (backend/, frontend/)
- **Arquivos JS:** camelCase (authController.js)
- **Arquivos CSS:** kebab-case (responsive.css)
- **HTML:** kebab-case (index.html)
- **JSON:** snake_case (products.json)

### Próximas Etapas
1. Criar estrutura de pastas
2. Inicializar repositório git
3. Configurar package.json
4. Criar variáveis de ambiente
