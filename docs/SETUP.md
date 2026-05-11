# Guia de Setup e Instalação

## Header
Instruções completas para configurar o projeto localmente, instalar dependências e preparar variáveis de ambiente.

---

## Main

### 1. Pré-requisitos

**Softwares necessários:**
- Node.js 18+ e npm
- Git
- Editor de código (VS Code recomendado)
- Navegador moderno

**Contas necessárias:**
- Stripe (para pagamentos)
- SendGrid (para emails)
- Vercel (para deploy)

---

### 2. Clonar/Criar Projeto

**Opção A - Clonar repositório (se já existir):**
```bash
git clone https://github.com/seu-usuario/projeto-ecommerce.git
cd projeto-ecommerce
```

**Opção B - Inicializar novo projeto:**
```bash
mkdir projeto-ecommerce
cd projeto-ecommerce
git init
```

---

### 3. Setup do Backend

#### 3.1 Instalar dependências
```bash
cd backend
npm init -y
npm install express cors dotenv bcryptjs jsonwebtoken axios
npm install --save-dev nodemon
```

#### 3.2 Criar arquivo .env
```bash
# backend/.env

# Servidor
PORT=3000
NODE_ENV=development

# Banco de dados
DB_PATH=./data

# JWT
JWT_SECRET=sua_chave_secreta_muito_segura_aqui
JWT_EXPIRE=24h

# Stripe
STRIPE_SECRET_KEY=sk_test_seu_stripe_key_aqui
STRIPE_PUBLIC_KEY=pk_test_seu_stripe_key_aqui

# SendGrid
SENDGRID_API_KEY=sua_sendgrid_api_key_aqui
SENDGRID_FROM_EMAIL=seu_email@exemplo.com

# URLs
FRONTEND_URL=http://localhost:5500
BACKEND_URL=http://localhost:3000
```

**Para obter as chaves:**
- [Stripe Dashboard](https://dashboard.stripe.com)
- [SendGrid API Keys](https://app.sendgrid.com/settings/api_keys)

#### 3.3 Criar estrutura de pastas
```bash
# Na pasta backend/
mkdir routes controllers middleware utils data
```

#### 3.4 Criar arquivo package.json scripts
```json
{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  }
}
```

#### 3.5 Iniciar servidor
```bash
npm run dev
# Servidor rodando em http://localhost:3000
```

---

### 4. Setup do Frontend

#### 4.1 Instalar dependências globais
```bash
# Instalar axios globalmente ou via CDN
# Adicionar no index.html:
<script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
```

#### 4.2 Estrutura de pastas
```bash
# Na pasta frontend/
mkdir css js assets
mkdir assets/images assets/icons
mkdir assets/images/samsung assets/images/iphone assets/images/xiaomi
```

#### 4.3 Servir localmente
**Opção A - Live Server (VS Code):**
1. Instalar extensão "Live Server"
2. Clicar com botão direito em index.html
3. Selecionar "Open with Live Server"
4. Será aberto em http://localhost:5500

**Opção B - Python (se tiver Python instalado):**
```bash
cd frontend
python -m http.server 5500
# Acessar em http://localhost:5500
```

**Opção C - Node.js:**
```bash
npm install -g http-server
cd frontend
http-server -p 5500
```

---

### 5. Criar Dados de Teste

#### 5.1 Criar products.json
```bash
# backend/data/products.json
```

Copiar modelo de [SCHEMA_BANCO.md](./SCHEMA_BANCO.md)

#### 5.2 Criar users.json
```bash
# backend/data/users.json
```

Copiar modelo de [SCHEMA_BANCO.md](./SCHEMA_BANCO.md)

#### 5.3 Criar orders.json
```bash
# backend/data/orders.json
{"orders": []}
```

---

### 6. Testar Conexão Backend-Frontend

**Teste simples:**
```javascript
// Abrir console do navegador (F12)
// Executar:
fetch('http://localhost:3000/api/products')
  .then(r => r.json())
  .then(d => console.log(d))
```

**Se funcionar, você verá os produtos listados.**

---

### 7. Variáveis de Ambiente

**Importante:**
- Nunca commitar .env no git
- Criar .env.example como modelo
- Cada desenvolvedor cria seu próprio .env

**Adicionar ao .gitignore:**
```
node_modules/
.env
.env.local
.DS_Store
*.log
```

---

### 8. Desenvolver Localmente

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd frontend
# Live Server (VS Code)
# ou
python -m http.server 5500
```

**Acessar em:** http://localhost:5500

---

### 9. Build para Produção

#### 9.1 Frontend
```bash
cd frontend
# Não precisa compilar (são arquivos estáticos)
# Apenas fazer deploy no Vercel
```

#### 9.2 Backend
```bash
cd backend
# Criar arquivo Procfile para Vercel
echo "web: node server.js" > Procfile
```

---

### 10. Deploy no Vercel

#### 10.1 Frontend

1. Fazer push do projeto no GitHub
2. Acessar [Vercel](https://vercel.com)
3. Conectar repositório
4. Deploy automático

#### 10.2 Backend (Serverless)

1. Modificar server.js para função serverless
2. Criar arquivo `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    {
      "src": "server.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "server.js"
    }
  ]
}
```

3. Deploy pelo Vercel CLI:
```bash
npm install -g vercel
vercel
```

---

### 11. Troubleshooting

**Erro: CORS error**
- Verificar se FRONTEND_URL está correto no .env

**Erro: Stripe key inválida**
- Verificar chaves em dashboard.stripe.com
- Usar chaves de teste (sk_test_...)

**Erro: SendGrid não envia email**
- Verificar SENDGRID_API_KEY
- Verificar SENDGRID_FROM_EMAIL é verificado na conta

**Porta 3000 já está em uso:**
```bash
# Mudar porta em .env
PORT=3001
```

**Erro de CORS no Stripe/SendGrid:**
- Frontend em http://localhost:5500
- Backend em http://localhost:3000
- Verificar headers CORS no backend

---

## Footer

### Checklist de Setup Completo
- [ ] Node.js 18+ instalado
- [ ] Repositório Git clonado/criado
- [ ] Backend: npm install feito
- [ ] Backend: .env criado com chaves
- [ ] Backend: npm run dev funcionando
- [ ] Frontend: Live Server/servidor rodando
- [ ] Stripe: chaves de teste configuradas
- [ ] SendGrid: API key configurada
- [ ] Teste fetch funcionando
- [ ] Estrutura de pastas criada

### Próximos Passos
1. Começar desenvolvimento das páginas HTML
2. Criar rotas do backend
3. Implementar autenticação
4. Integrar Stripe
5. Implementar SendGrid
6. Deploy no Vercel

### Comandos Úteis
```bash
# Backend
npm run dev          # Rodar com nodemon
npm start            # Rodar sem nodemon
npm install          # Instalar dependências

# Frontend (no Live Server)
Ctrl+S               # Salvar e refresh automático

# Git
git add .
git commit -m "feat: descrição"
git push origin main
```
