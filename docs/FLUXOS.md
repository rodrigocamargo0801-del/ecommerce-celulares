# Fluxos Principais do Sistema

## Header
Diagramas e descrição dos principais fluxos de negócio do e-commerce: navegação, compra, administração.

---

## Main

### 1. Fluxo de Navegação do Cliente

```
┌─────────────┐
│   HOME      │ Catálogo com busca/filtros
│  (index)    │
└──────┬──────┘
       │
       ├─→ Buscar/Filtrar
       │
       └─→ Clica em Produto
          │
          ▼
       ┌──────────────┐
       │   DETALHES   │ Specs, preço, avaliações
       │  (produto)   │
       └──────┬───────┘
              │
              ├─→ "Adicionar ao Carrinho"
              │   (localStorage)
              │
              └─→ Voltar ao Catálogo
```

---

### 2. Fluxo de Compra Completo

```
┌──────────────┐
│   CARRINHO   │ Revisar itens
│  (carrinho)  │ Ajustar quantidades
└──────┬───────┘
       │
       ├─→ Continuar comprando
       │   (volta ao catálogo)
       │
       └─→ "Finalizar Compra"
          │
          ▼
       ┌──────────────┐
       │   LOGIN?     │ Se não logado
       │              │ ├─→ Fazer Login
       │              │ └─→ ou Cadastrar
       └──────┬───────┘
              │
              ▼
       ┌──────────────────┐
       │   CHECKOUT       │ Confirmar endereço
       │  (checkout)      │ Escolher frete
       └──────┬───────────┘
              │
              ▼
       ┌──────────────────┐
       │   PAGAMENTO      │ Escolher método
       │                  │ ├─→ Cartão (Stripe)
       │                  │ ├─→ PIX (Stripe)
       │                  │ └─→ Boleto (Stripe)
       └──────┬───────────┘
              │
              ▼
       ┌──────────────────┐
       │   PROCESSANDO    │ Stripe processa
       │   PAGAMENTO      │ Backend valida
       └──────┬───────────┘
              │
         Sucesso?
         /      \
        ▼        ▼
      SIM       NÃO
      │         │
      ▼         └─→ Erro: Tentar novamente
   ┌─────────────┐
   │  CONFIRMAR  │
   │   PEDIDO    │
   │             │
   │ ✓ Salvar    │
   │ ✓ Email     │
   │ ✓ Carrinho  │
   │   limpo     │
   └─────┬───────┘
         │
         ▼
   ┌─────────────────┐
   │  SUCESSO        │
   │  Pedido #001    │
   │  Email enviado  │
   └─────────────────┘
```

---

### 3. Fluxo de Autenticação

```
┌──────────────────────────────────────┐
│         NOVO USUÁRIO?                │
└─────────────┬────────────────────────┘
              │
         Sim  │  Não
             ▼   ▼
          ┌────────────────┐
          │   CADASTRO     │ Email
          │   (login.html) │ Senha (mín 8)
          │                │ Confirmar senha
          └────────┬───────┘
                   │
                   ├─→ Validar email único
                   ├─→ Hash senha (bcrypt)
                   ├─→ Salvar em users.json
                   │
                   ▼
          ┌──────────────────┐
          │  LOGIN AUTOMÁTICO│
          │  Gerar JWT token │
          │  localStorage    │
          └────────┬─────────┘
                   │
                   ▼
          ┌──────────────────┐
          │   REDIRECIONADO  │
          │   Para Home      │
          │   User logado    │
          └──────────────────┘

ALTERNATIVA: LOGIN COM CONTA EXISTENTE
          ┌──────────────┐
          │   LOGIN      │ Email + Senha
          │  (login.html)│
          └────────┬─────┘
                   │
                   ├─→ Buscar usuário
                   ├─→ Validar hash
                   │
              Válido?
              /      \
             ▼        ▼
           SIM       NÃO
           │         │
           ▼         └─→ Erro: Tente novamente
        ┌────────────────┐
        │ Gerar JWT      │
        │ localStorage   │
        │ Redirecionar   │
        └────────────────┘
```

---

### 4. Fluxo do Painel Admin

```
┌──────────────────┐
│   ADMIN LOGIN    │ Só funciona com
│   (admin.html)   │ tipo="admin"
└────────┬─────────┘
         │
         ├─→ Validação JWT
         │
         ▼
    ┌──────────────┐
    │   DASHBOARD  │ Opções:
    │              │
    │ Produtos     │◄─── Gerenciar (CRUD)
    │ Pedidos      │◄─── Ver todos, atualizar status
    │ Usuários     │◄─── Listar
    │ Relatórios   │◄─── Vendas por período
    │              │
    └──────────────┘
         │
         ▼
    ┌──────────────────┐
    │ GERENCIAR        │ Criar novo
    │ PRODUTOS         │ Editar
    │                  │ Deletar
    │                  │ Atualizar estoque
    └──────────────────┘
         │
         └─→ Salvar em products.json
             Validações:
             • Nome único
             • Preço > 0
             • Estoque >= 0
             • Imagem upload
```

---

### 5. Fluxo de Pedido após Compra

```
┌──────────────────┐
│  PEDIDO CRIADO   │ Salvo em orders.json
│  Status: confirmado
│  Pagamento: pago
└────────┬─────────┘
         │
         ├─→ Enviar Email (SendGrid)
         │
         ▼
    ┌─────────────────┐
    │  CLIENTE RECEBE │ Detalhes do pedido
    │  EMAIL DE       │ Nº de rastreamento
    │  CONFIRMAÇÃO    │ Link para acompanhar
    └────────┬────────┘
             │
             ├─→ Cliente visualiza em "Meus Pedidos"
             │
             ▼
    ┌─────────────────┐
    │  ADMIN PROCESSA │ Atualiza status:
    │  PEDIDO         │ • pendente
    │                 │ • confirmado
    │                 │ • enviado
    │                 │ • entregue
    │                 │ • cancelado
    └────────┬────────┘
             │
             ├─→ Cada mudança envia email
             │
             ▼
    ┌──────────────────┐
    │ PEDIDO ENTREGUE  │ Ciclo completo
    │ Status: entregue │
    └──────────────────┘
```

---

### 6. Fluxo de Dados - API

```
CLIENTE
  │
  ├─ POST /api/auth/register
  │  ├─ Body: {nome, email, senha, ...}
  │  ├─ Validação: email único, senha forte
  │  ├─ Hash: bcrypt
  │  └─ Response: {token, user}
  │
  ├─ POST /api/auth/login
  │  ├─ Body: {email, senha}
  │  ├─ Validação: credenciais
  │  └─ Response: {token, user}
  │
  ├─ GET /api/products
  │  ├─ Query: ?busca=iPhone&marca=Apple&preço_max=5000
  │  └─ Response: [{produto}, ...]
  │
  ├─ GET /api/products/:id
  │  └─ Response: {produto_completo}
  │
  ├─ POST /api/orders
  │  ├─ Body: {produtos, endereco, pagamento}
  │  ├─ Auth: JWT token required
  │  ├─ Stripe: processa pagamento
  │  ├─ SendGrid: envia email
  │  └─ Response: {pedido, token}
  │
  └─ GET /api/orders (usuário logado)
     └─ Response: [{pedido}, ...]
```

---

## Footer

### Estados Possíveis

**Carrinho:** empty, filled, processing, completed

**Pedido:** pending, confirmado, enviado, entregue, cancelado

**Pagamento:** pending, pago, failed, refunded

**Usuário:** não_autenticado, cliente, admin

### Tratamento de Erros

Todos os fluxos incluem tratamento de erros:
- Validação de dados
- Try/catch em operações async
- Mensagens amigáveis ao usuário
- Log de erros no servidor
- Fallback gracioso
