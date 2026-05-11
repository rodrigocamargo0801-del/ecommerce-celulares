# E-commerce de Celulares 📱

## Header
Plataforma completa de e-commerce para venda de celulares das principais marcas. Sistema responsivo com autenticação, pagamentos integrados e painel administrativo.

---

## Main

### 🎯 Visão Geral

**Projeto:** E-commerce de Celulares  
**Stack:** Node.js + HTML/CSS/JavaScript  
**Banco:** JSON local  
**Deploy:** Vercel  
**Status:** 🚀 Em desenvolvimento

### 🚀 Funcionalidades

#### Cliente
- ✅ Catálogo de produtos com busca e filtros
- ✅ Detalhes completos do produto
- ✅ Carrinho de compras persistente
- ✅ Login e cadastro seguro
- ✅ Processamento de pagamentos (Cartão, PIX, Boleto)
- ✅ Email de confirmação
- ✅ Histórico de pedidos
- ✅ Responsivo (mobile, tablet, desktop)

#### Administrador
- ✅ Painel de controle completo
- ✅ Gerenciamento de produtos (CRUD)
- ✅ Acompanhamento de pedidos
- ✅ Controle de estoque
- ✅ Relatórios de vendas
- ✅ Gerenciamento de usuários

### 📁 Estrutura do Projeto

```
projeto-ecommerce/
├── frontend/               # App cliente
│   ├── *.html             # Páginas
│   ├── css/               # Estilos
│   ├── js/                # Lógica
│   └── assets/            # Imagens e ícones
│
├── backend/               # API Node.js
│   ├── server.js          # Inicialização
│   ├── routes/            # Endpoints
│   ├── controllers/       # Lógica de negócio
│   ├── middleware/        # Autenticação
│   ├── utils/             # Funções utilitárias
│   ├── data/              # JSON (database)
│   └── .env               # Variáveis de ambiente
│
├── docs/                  # Documentação
│   ├── ARQUITETURA.md
│   ├── ESTRUTURA_PASTAS.md
│   ├── SCHEMA_BANCO.md
│   ├── FUNCIONALIDADES.md
│   ├── FLUXOS.md
│   ├── API_ENDPOINTS.md
│   └── SETUP.md
│
└── README.md              # Este arquivo
```

### 🛠️ Tecnologias

**Frontend:**
- HTML5
- CSS3 (Responsive)
- JavaScript Vanilla
- Axios (requisições HTTP)

**Backend:**
- Node.js
- Express.js
- bcryptjs (hash de senhas)
- JWT (autenticação)

**Integrações:**
- Stripe (pagamentos)
- SendGrid (emails)

**Deploy:**
- Vercel (frontend + backend serverless)

### 📚 Documentação

- **[SETUP.md](./docs/SETUP.md)** - Guia de instalação e configuração
- **[ARQUITETURA.md](./docs/ARQUITETURA.md)** - Visão geral da arquitetura
- **[ESTRUTURA_PASTAS.md](./docs/ESTRUTURA_PASTAS.md)** - Organização de pastas
- **[FUNCIONALIDADES.md](./docs/FUNCIONALIDADES.md)** - Features detalhadas
- **[FLUXOS.md](./docs/FLUXOS.md)** - Diagramas de fluxo
- **[API_ENDPOINTS.md](./docs/API_ENDPOINTS.md)** - Documentação da API
- **[SCHEMA_BANCO.md](./docs/SCHEMA_BANCO.md)** - Estrutura dos dados JSON

### 🚀 Quick Start

#### 1. Clonar/Criar Projeto
```bash
git clone <seu-repo>
cd projeto-ecommerce
```

#### 2. Setup Backend
```bash
cd backend
npm install
cp .env.example .env
# Editar .env com suas chaves
npm run dev
```

#### 3. Setup Frontend
```bash
cd frontend
# Usar Live Server no VS Code
# ou
python -m http.server 5500
```

#### 4. Acessar
```
http://localhost:5500
```

### 🔐 Variáveis de Ambiente

Criar arquivo `.env` na pasta `backend/`:

```env
PORT=3000
NODE_ENV=development
JWT_SECRET=sua_chave_secreta
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=sua_api_key
SENDGRID_FROM_EMAIL=seu@email.com
FRONTEND_URL=http://localhost:5500
```

### 💳 Pagamentos (Stripe)

Testar com cartão: `4242 4242 4242 4242`
- Data qualquer futura
- CVC: qualquer 3 dígitos

### 📧 Emails (SendGrid)

Confirmação automática enviada após pagamento confirmado.

### 👤 Usuários de Teste

**Cliente:**
- Email: `cliente@email.com`
- Senha: `senha123456`

**Admin:**
- Email: `admin@email.com`
- Senha: `admin123456`

### 📈 Roadmap

**MVP (v1.0):**
- [x] Catálogo e busca
- [x] Carrinho
- [x] Login/Cadastro
- [x] Pagamentos
- [x] Email confirmação
- [ ] Deploy Vercel

**Fase 2 (v1.1):**
- [ ] Painel Admin completo
- [ ] Histórico de pedidos
- [ ] Filtros avançados

**Fase 3 (v2.0):**
- [ ] Reviews e ratings
- [ ] Wishlist
- [ ] Notificações
- [ ] Chat com suporte

### 🔧 Troubleshooting

**Porta 3000 em uso:**
```bash
# Mudar em .env
PORT=3001
```

**CORS error:**
- Verificar FRONTEND_URL no .env
- Confirmar headers CORS no server.js

**Stripe/SendGrid erro:**
- Verificar chaves no .env
- Testar em [Stripe Dashboard](https://dashboard.stripe.com)

### 📞 Suporte

**Contato:**
- Email: rodrigocamargo0801@gmail.com
- GitHub: [@seu-usuario]

### 📄 Licença

MIT

### 👨‍💻 Desenvolvedor

**Rodrigo Camargo**
- Email: rodrigocamargo0801@gmail.com
- Projeto: Contratos Marcenaria

---

## Footer

### Próximas Ações

1. ✅ Documentação criada
2. 📦 Setup do projeto
3. 🎨 Criar páginas HTML
4. 🔧 Implementar backend
5. 🚀 Deploy

### Links Úteis

- [Stripe Docs](https://stripe.com/docs)
- [SendGrid Docs](https://sendgrid.com/docs)
- [Express.js Docs](https://expressjs.com)
- [Vercel Docs](https://vercel.com/docs)

### Dúvidas?

Consulte a documentação em `docs/` ou entre em contato.

---

**Última atualização:** 11/05/2026
