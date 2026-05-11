# Guia de Testes - E-commerce Celulares

## Header
Instruções completas para testar todos os recursos do e-commerce. Inclui dados de teste, fluxos principais e funcionalidades.

---

## Main

### 🧪 Dados de Teste Já Carregados

#### Usuários
**Admin:**
- Email: `rodrigocamargo0801@gmail.com`
- Senha: `senha123456`
- Tipo: Admin

**Cliente 1:**
- Email: `joao@email.com`
- Senha: `senha123456`
- Tipo: Cliente

**Cliente 2:**
- Email: `maria@email.com`
- Senha: `senha123456`
- Tipo: Cliente

#### Produtos (5)
1. iPhone 15 Pro - R$ 4.999,00
2. Samsung Galaxy S24 - R$ 4.499,00
3. Xiaomi 14 Ultra - R$ 2.999,00
4. iPhone 15 - R$ 3.999,00
5. Samsung Galaxy A54 - R$ 1.999,00

#### Cartão de Teste
- Número: `4242 4242 4242 4242`
- Validade: Qualquer data futura
- CVC: Qualquer 3 dígitos

---

### ✅ Fluxos de Teste

#### 1. Navegar pelo Catálogo
```
1. Acessar http://localhost:5500
2. Ver 5 celulares listados
3. Usar filtros:
   - Buscar por "iPhone"
   - Filtrar por marca "Samsung"
   - Ordenar por "Menor Preço"
```

#### 2. Testar Detalhes do Produto
```
1. Clicar em qualquer produto
2. Ver detalhes completos (especificações, preço, etc.)
3. Alterar quantidade
4. Adicionar ao carrinho
```

#### 3. Testar Carrinho
```
1. Ir para página do carrinho
2. Ver itens adicionados
3. Aumentar/diminuir quantidade
4. Remover itens
5. Ver resumo com subtotal e frete (R$ 50)
6. Clicar em "Finalizar Compra"
```

#### 4. Testar Login/Cadastro
```
A. Login:
   1. Clicar em "Login"
   2. Usar dados de teste (joao@email.com / senha123456)
   3. Fazer login com sucesso
   4. Ver nome do usuário no menu

B. Cadastro:
   1. Clicar em "Login"
   2. Ir para "Criar Conta"
   3. Preencher formulário com dados novos
   4. Criar conta com sucesso
   5. Ser logado automaticamente
```

#### 5. Testar Checkout e Pagamento
```
1. Com usuário logado, ir para checkout
2. Preencher endereço:
   - Rua: Avenida Principal
   - Número: 100
   - Complemento: Apt 200
   - Cidade: São Paulo
   - Estado: SP
   - CEP: 01234-567

3. Escolher método de pagamento:
   - Cartão: Preencher com dados de teste
   - PIX: Simular (sem dados necessários)
   - Boleto: Simular (sem dados necessários)

4. Confirmar e pagar
5. Ver mensagem de sucesso
6. Ser redirecionado para pedidos
```

#### 6. Testar Histórico de Pedidos
```
1. Ir para "Meus Pedidos" após fazer compra
2. Ver lista de pedidos criados
3. Clicar em um pedido para ver detalhes:
   - Produtos
   - Valores
   - Endereço
   - Status
```

#### 7. Testar Painel Admin
```
1. Fazer login com: rodrigocamargo0801@gmail.com
2. Acessar http://localhost:5500/admin.html
3. Ver dashboard com:
   - Estatísticas
   - Produtos mais vendidos
4. Ir para "Produtos":
   - Ver lista de produtos
   - Criar novo produto
   - Deletar produto
5. Ir para "Pedidos":
   - Ver todos os pedidos
   - Mudar status de um pedido
6. Ir para "Usuários":
   - Ver lista de usuários
   - Ver histórico de compras
```

---

### 🐛 Testes de Validação

#### Validação de Formulários
```
✓ Login com email inválido → Erro
✓ Login com senha inválida → Erro
✓ Cadastro com senha < 8 caracteres → Erro
✓ Cadastro com senhas diferentes → Erro
✓ Cadastro com email já existente → Erro
✓ Checkout com endereço incompleto → Erro
✓ Criação de produto sem nome → Erro
```

#### Validação de Estoque
```
✓ Carrinho limitado ao estoque disponível
✓ Pedido não aceita quantidade maior que estoque
✓ Estoque reduzido após pedido confirmado
✓ Estoque restaurado se pedido for cancelado
```

#### Validação de Autenticação
```
✓ Página /admin.html sem login → Redireciona para login
✓ Página /admin.html com user não-admin → Bloqueia acesso
✓ Página /checkout.html sem login → Redireciona para login
✓ Página /pedidos.html sem login → Redireciona para login
```

---

### 🔄 Testes de Fluxo Completo

#### Fluxo 1: Cliente Novo
```
1. Acessar home
2. Navegar pelo catálogo
3. Ver produto (iPhone 15 Pro)
4. Adicionar ao carrinho
5. Ir para carrinho
6. Finalizar compra (leva para login)
7. Criar nova conta
8. Ir para checkout
9. Preencher endereço
10. Escolher pagamento
11. Confirmar pedido
12. Ver sucesso
13. Ir para "Meus Pedidos"
14. Ver pedido criado
```

#### Fluxo 2: Admin Gerenciando Pedidos
```
1. Login como admin
2. Acessar painel admin
3. Ver dashboard com estatísticas
4. Ir para "Pedidos"
5. Alterar status de um pedido (pendente → confirmado → enviado)
6. Ver email de atualização seria enviado
7. Cliente vê atualização em "Meus Pedidos"
```

#### Fluxo 3: Admin Criando Produto
```
1. Login como admin
2. Acessar painel admin
3. Ir para "Produtos"
4. Clicar "+ Novo Produto"
5. Preencher dados:
   - Nome: Samsung Galaxy A55
   - Marca: Samsung
   - Preço: 2.499,00
   - Estoque: 100
6. Salvar produto
7. Ver novo produto em lista
8. Acessar home como cliente
9. Ver novo produto no catálogo
```

---

### 📊 Métricas para Testar

**Performance:**
- Tempo de carregamento da home: < 2s
- Busca e filtros: < 500ms
- Login: < 1s
- Checkout: < 2s

**Responsividade:**
- Testar em dispositivos:
  - Desktop (1920x1080)
  - Tablet (768x1024)
  - Mobile (375x667)

**Compatibilidade:**
- Chrome (Latest)
- Firefox (Latest)
- Safari (Latest)
- Edge (Latest)

---

### 🚨 Testes de Segurança

**Autenticação:**
```
✓ Token JWT é armazenado
✓ Requisições incluem token
✓ Token expirado redireciona para login
✓ Senhas são hasheadas (não visíveis)
```

**Autorização:**
```
✓ Clientes não podem acessar /admin.html
✓ Clientes não podem deletar produtos
✓ Clientes não podem atualizar status de outro usuário
✓ Admins podem fazer tudo
```

**Validação:**
```
✓ SQL injection não funciona (JSON não usado)
✓ XSS: inputs são escapados
✓ CSRF: não aplicável (stateless)
```

---

### 📱 Teste de Responsividade

**Mobile (375px):**
```
✓ Menu hambúrguer (se implementado)
✓ Navbar colapsável
✓ Grid de produtos em 1 coluna
✓ Formulários em tela inteira
✓ Tabelas scrolláveis
```

**Tablet (768px):**
```
✓ Grid de produtos em 2 colunas
✓ Navbar normal
✓ Layout lado-a-lado no checkout
```

**Desktop (1920px):**
```
✓ Grid de produtos em 4+ colunas
✓ Layout otimizado
✓ Sidebar do admin visível
```

---

### 🎯 Checklist Final de Testes

- [ ] Home carrega sem erros
- [ ] Catálogo mostra 5 produtos
- [ ] Busca e filtros funcionam
- [ ] Clique em produto mostra detalhes
- [ ] Adicionar ao carrinho funciona
- [ ] Carrinho mostra itens corretos
- [ ] Login com usuário de teste funciona
- [ ] Cadastro de novo usuário funciona
- [ ] Checkout com dados válidos funciona
- [ ] Pagamento é processado
- [ ] Pedido é criado com sucesso
- [ ] Email é "enviado" (simulado)
- [ ] "Meus Pedidos" mostra pedidos do usuário
- [ ] Admin pode ver painel
- [ ] Admin pode criar produto
- [ ] Admin pode deletar produto
- [ ] Admin pode atualizar status de pedido
- [ ] Responsividade funciona em mobile
- [ ] Responsividade funciona em tablet
- [ ] Segurança: apenas admins acessam /admin.html

---

## Footer

### Próximos Testes Manuais Recomendados

1. **Teste de Carga:**
   - Simular 100 acessos simultâneos
   - Verificar performance

2. **Teste de Integração:**
   - Stripe com pagamentos reais (opcional)
   - SendGrid com emails reais (opcional)

3. **Teste de Usabilidade:**
   - Pedir feedback de usuários reais
   - A/B teste do checkout

4. **Teste de Acessibilidade:**
   - Usar leitores de tela
   - Testar com teclado apenas
   - Verificar contraste de cores

### Comandos Úteis para Testar

```bash
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
cd frontend
python -m http.server 5500

# Acessar
http://localhost:5500
```

### Reportar Bugs

Sempre forneça:
1. Passos para reproduzir
2. Resultado esperado
3. Resultado atual
4. Screenshot (se aplicável)
5. Browser e versão
6. Sistema operacional
