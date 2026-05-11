# 🚀 Guia de Deploy para Vercel

## Header
Instruções completas para colocar o e-commerce de celulares em produção no Vercel

---

## Main

### ⚡ Quick Deploy (5 minutos)

#### 1. Pré-requisitos
- Conta GitHub
- Conta Vercel (grátis em https://vercel.com)
- Git instalado localmente

#### 2. Fazer Push para GitHub

```bash
# No terminal, na pasta do projeto
git add .
git commit -m "feat: Projeto e-commerce completo pronto para Vercel"
git branch -M main
git remote add origin https://github.com/seu-usuario/seu-repositorio.git
git push -u origin main
```

#### 3. Deploy no Vercel

**Opção A: Via CLI Vercel (Recomendado)**

```bash
# Instalar Vercel CLI
npm i -g vercel

# Fazer deploy
cd "C:\Users\rocam\OneDrive\Contratos Marcenaria"
vercel
```

Responder às perguntas:
- `? Set up and deploy "seu-projeto"?` → **y**
- `? Which scope do you want to deploy to?` → Selecionar sua conta
- `? Link to existing project?` → **n**
- `? What's your project's name?` → `ecommerce-celulares`
- `? In which directory is your code located?` → **./** (raiz do projeto)
- `? Want to modify these settings?` → **n**

**Opção B: Via Web (Mais fácil para iniciantes)**

1. Acessar https://vercel.com/new
2. Conectar com GitHub
3. Selecionar o repositório
4. Vercel detectará automáticamente a configuração
5. Clicar em "Deploy"

---

### 🔐 Configurar Variáveis de Ambiente

Após o deploy inicial, adicionar as variáveis de ambiente:

#### No Dashboard do Vercel

1. Acessar https://vercel.com/dashboard
2. Selecionar seu projeto
3. Ir para **Settings** → **Environment Variables**
4. Adicionar:

| Chave | Valor |
|-------|-------|
| `JWT_SECRET` | `chave_super_secreta_aleatoria_minimo_32_caracteres` |
| `STRIPE_SECRET_KEY` | `sk_test_...seu_stripe_secret` (da conta Stripe) |
| `STRIPE_PUBLIC_KEY` | `pk_test_...seu_stripe_public` (da conta Stripe) |
| `SENDGRID_API_KEY` | `SG.seu_sendgrid_api_key` (da conta SendGrid) |
| `SENDGRID_FROM_EMAIL` | `seu-email@exemplo.com` |
| `FRONTEND_URL` | `https://seu-projeto.vercel.app` |
| `NODE_ENV` | `production` |

5. Clicar em "Save"
6. Fazer redeploy no Vercel

---

### 📱 Atualizar Frontend para Produção

O frontend está em `frontend/` como HTML/CSS/JS estático. Vercel vai servir automaticamente.

**Apenas certifique-se de que `frontend/js/api.js` usa a URL correta:**

```javascript
// Verificar em frontend/js/api.js:
const API_BASE_URL = window.location.origin + '/api'; // ✅ Correto para Vercel
// OU
const API_BASE_URL = 'https://seu-projeto.vercel.app/api'; // ✅ Também funciona
```

---

### ✅ Pós-Deploy Checklist

- [ ] Acessar https://seu-projeto.vercel.app
- [ ] Home carrega sem erros
- [ ] Catálogo mostra 5 produtos
- [ ] Busca funciona
- [ ] Filtros funcionam
- [ ] Clicar em produto mostra detalhes
- [ ] Adicionar ao carrinho funciona
- [ ] Carrinho persiste (localStorage)
- [ ] Login/Cadastro funciona
- [ ] Checkout funciona
- [ ] Admin painel acessível em /admin.html
- [ ] Senhas funcionam (bcrypt)
- [ ] Tokens JWT funcionam
- [ ] CORS configurado corretamente

---

### 🔄 Fazer Deploy de Atualizações

Toda vez que você atualizar o código:

```bash
# Opção 1: Via Git
git add .
git commit -m "feat: descrição da mudança"
git push origin main
# Vercel fará deploy automaticamente

# Opção 2: Via CLI
vercel --prod
```

---

### 📊 Monitorar em Produção

1. **Dashboard Vercel:** https://vercel.com/dashboard
   - Ver logs de deploy
   - Monitorar performance
   - Verificar erros

2. **Logs do Projeto**
   - Clicar no projeto
   - Ir para "Deployments"
   - Selecionar um deploy
   - Ver "Logs"

3. **Console do Browser**
   - F12 no navegador
   - Aba "Console"
   - Ver erros/warnings

---

### 🆘 Solução de Problemas

#### ❌ "Cannot find module"
**Solução:** Verificar paths em `api/index.js`
```javascript
// Correto:
require('../backend/routes/auth')

// Incorreto:
require('./backend/routes/auth')
```

#### ❌ "CORS error"
**Solução:** Adicionar domínio em `api/index.js`
```javascript
origin: [
  'https://seu-projeto.vercel.app',
  'http://localhost:5500'
]
```

#### ❌ "401 Unauthorized"
**Solução:** Verificar JWT_SECRET está definido no Vercel

#### ❌ "Port already in use"
**Solução:** Vercel gerencia portas automaticamente, não necessário configurar

---

### 💾 Dados em Produção

Atualmente, dados são armazenados em JSON (`backend/data/`).

**Para um banco de dados real em produção:**

1. **Conectar a MongoDB:**
   ```bash
   npm install mongoose
   ```

2. **Ou usar Supabase (PostgreSQL):**
   ```bash
   npm install @supabase/supabase-js
   ```

3. **Ou usar Firebase:**
   ```bash
   npm install firebase-admin
   ```

Para agora, JSON funciona e Vercel salva em storage ephemeral (perdido a cada deploy).

---

### 🎯 Próximas Etapas

1. **Domínio customizado:**
   - Settings → Domains
   - Adicionar domínio
   - Configurar DNS

2. **SSL/TLS (Automático):**
   - Vercel fornece certificado Let's Encrypt automaticamente

3. **Analytics:**
   - Vercel Analytics
   - Google Analytics
   - Stripe Analytics

4. **Integração com Pagamentos Real:**
   - Criar conta Stripe (modo produção)
   - Adicionar chaves reais em Environment Variables
   - Testar com cartão real (Stripe oferece dados de teste)

5. **Envio de Emails Real:**
   - Criar conta SendGrid
   - Adicionar API key
   - Testar envio de emails

---

## Footer

### Status do Deploy

✅ **Pronto para Produção**

O projeto está completamente configurado para Vercel:
- Frontend: HTML/CSS/JS estático
- Backend: Serverless Functions (Node.js)
- Banco de dados: JSON (ephemeral storage)
- Autenticação: JWT seguro
- Pagamentos: Stripe integrado

### URLs Importantes

| Recurso | URL |
|---------|-----|
| Vercel Dashboard | https://vercel.com/dashboard |
| Seu Projeto | https://seu-projeto.vercel.app |
| Admin | https://seu-projeto.vercel.app/admin.html |
| API Health | https://seu-projeto.vercel.app/api/health |

### Suporte

- Documentação Vercel: https://vercel.com/docs
- Problemas comuns: Leia `docs/GUIA_TESTES.md`
- Arquitetura: Leia `docs/ARQUITETURA.md`

---

**Desenvolvido com ❤️ por Claude Code**

**Versão:** 1.0.0

**Status:** 🟢 Pronto para Deploy
