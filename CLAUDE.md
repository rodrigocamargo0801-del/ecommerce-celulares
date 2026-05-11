# CLAUDE.md - E-commerce de Celulares

## Header
Projeto de e-commerce para venda de celulares das principais marcas. Sistema completo com frontend responsivo, backend Node.js, autenticação, processamento de pagamentos e painel administrativo.

---

## Main

### Informações do Projeto
- **Nome:** E-commerce Celulares
- **Objetivo:** Vender celulares online
- **Usuários:** Clientes finais + Administrador
- **Stack:** Node.js (Backend), HTML/CSS/JavaScript (Frontend)
- **Deploy:** Vercel
- **Status:** Em desenvolvimento

### Tecnologias Específicas
- **Frontend:** HTML5, CSS3, JavaScript Vanilla, Axios
- **Backend:** Node.js, Express.js
- **Banco de Dados:** JSON local (file system)
- **Autenticação:** JWT + bcrypt
- **Pagamentos:** Stripe (cartão, PIX, Boleto)
- **Email:** SendGrid
- **Hosting:** Vercel

### Estrutura do Projeto
```
projeto-ecommerce/
├── frontend/          # App cliente
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── assets/
├── backend/           # API Node.js
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── data/          # JSON files
│   └── utils/
└── docs/              # Documentação
```

### Permissões Automáticas
- ✅ Criar, editar e deletar arquivos
- ✅ Executar comandos npm/node
- ✅ Fazer commits e push
- ✅ Modificar arquivos de configuração

### Funcionalidades Principais
1. **Catálogo de Produtos** - Celulares com filtros e busca
2. **Carrinho de Compras** - Persistente no localStorage
3. **Autenticação** - Login/Cadastro com hash seguro
4. **Pagamentos** - Cartão, PIX, Boleto via Stripe
5. **Email** - Confirmação de compra via SendGrid
6. **Painel Admin** - Gerenciamento de produtos
7. **Histórico de Pedidos** - Para clientes logados

---

## Footer

### Próximas Ações
1. Criar estrutura de pastas
2. Gerar documentação detalhada
3. Inicializar projeto (npm init)
4. Configurar variáveis de ambiente
5. Começar desenvolvimento
