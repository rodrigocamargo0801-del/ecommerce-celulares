# Funcionalidades do Sistema

## Header
Descrição detalhada de todas as funcionalidades do e-commerce, incluindo fluxos de usuário e requisitos técnicos.

---

## Main

### 1. Catálogo de Produtos

**Descrição:** Página principal com listagem de todos os celulares disponíveis.

**Funcionalidades:**
- Exibir grid de produtos com imagem, nome, preço e rating
- Busca por nome ou marca
- Filtrar por marca (Apple, Samsung, Xiaomi, etc.)
- Filtrar por faixa de preço
- Ordenar por preço (crescente/decrescente) ou popularidade
- Paginação ou scroll infinito
- Responsive para mobile, tablet e desktop

**Dados Necessários:**
- ID, Nome, Marca, Preço, Desconto, Imagem, Rating, Estoque

---

### 2. Detalhes do Produto

**Descrição:** Página individual com informações completas do celular.

**Funcionalidades:**
- Exibir imagem grande do produto
- Mostrar especificações técnicas completas
- Exibir preço, desconto e avaliação
- Mostrar disponibilidade de estoque
- Botão "Adicionar ao Carrinho"
- Produtos relacionados (mesma marca)
- Avaliações e comentários de clientes

**Dados Necessários:**
- Todas as informações do produto (specs, reviews, etc.)

---

### 3. Carrinho de Compras

**Descrição:** Gerenciador de itens antes de finalizar compra.

**Funcionalidades:**
- Listar produtos adicionados com quantidade
- Alterar quantidade de cada produto
- Remover produtos do carrinho
- Calcular subtotal e total
- Aplicar cupom de desconto (opcional)
- Estimar frete
- Persistir no localStorage
- Ir para checkout

**Armazenamento:** localStorage (offline)

---

### 4. Autenticação (Login/Cadastro)

**Descrição:** Sistema de autenticação para clientes e administradores.

**Funcionalidades:**
- **Cadastro:**
  - Validar email único
  - Validar senha forte (mín 8 caracteres)
  - Confirmar senha
  - Aceitar termos de uso
  - Criptografar senha com bcrypt
  - Gerar JWT token

- **Login:**
  - Validar email e senha
  - Retornar JWT token
  - Armazenar em localStorage
  - Redirecionar para home ou página anterior
  - Link "Esqueceu senha?" (opcional)

- **Logout:**
  - Remover token do localStorage
  - Limpar dados de sessão
  - Redirecionar para home

**Segurança:**
- Senhas hasheadas com bcrypt
- JWT com expiração (24h)
- Validação em todas as requisições

---

### 5. Checkout e Pagamento

**Descrição:** Finalização de compra com processamento de pagamento.

**Fluxo:**
1. Confirmar dados de entrega
2. Escolher método de pagamento
3. Processar pagamento (Stripe)
4. Confirmar pedido
5. Enviar email de confirmação
6. Redirecionar para página de sucesso

**Métodos de Pagamento:**
- Cartão de Crédito (Stripe)
- PIX (Stripe)
- Boleto (Stripe)

**Dados Necessários:**
- Endereço de entrega
- Informações de pagamento
- Contato para confirmação

---

### 6. Histórico de Pedidos

**Descrição:** Página com todos os pedidos do usuário logado.

**Funcionalidades:**
- Listar pedidos com data, status e total
- Detalhes de cada pedido
- Rastrear status de entrega
- Cancelar pedido (se pendente)
- Imprimir comprovante

**Dados Necessários:**
- Todos os pedidos do usuário

---

### 7. Painel Administrativo

**Descrição:** Interface para gerenciamento de produtos e pedidos.

**Funcionalidades:**

**Produtos:**
- Listar todos os produtos
- Criar novo produto
- Editar informações do produto
- Deletar produto
- Gerenciar estoque
- Upload de imagens

**Pedidos:**
- Listar todos os pedidos
- Filtrar por status
- Atualizar status do pedido
- Visualizar detalhes
- Gerar relatório de vendas

**Usuários:**
- Listar usuários cadastrados
- Ver histórico de compras
- Deletar usuário (opcional)

**Acesso:** Apenas usuários com tipo "admin"

---

### 8. Email de Confirmação

**Descrição:** Envio automático de confirmação de pedido.

**Funcionalidades:**
- Enviar email após confirmação de pagamento
- Incluir detalhes do pedido
- Incluir tracking ID
- Usar template HTML
- SendGrid integration

**Gatilhos:**
- Após pagamento confirmado
- Após atualização de status do pedido

---

### 9. Responsividade e Design

**Descrição:** Interface adaptável para todos os dispositivos.

**Breakpoints:**
- Mobile: até 480px
- Tablet: 481px - 1024px
- Desktop: acima de 1024px

**Recursos:**
- Menu hamburger em mobile
- Imagens responsivas
- Touchscreen-friendly
- Performance otimizada
- Acessibilidade (WCAG)

---

## Footer

### Prioridade das Funcionalidades

**MVP (Mínimo Viável):**
1. Catálogo com busca e filtros
2. Detalhes do produto
3. Carrinho de compras
4. Login/Cadastro
5. Pagamento via Stripe
6. Email de confirmação

**Fase 2:**
7. Histórico de pedidos
8. Painel admin completo

**Fase 3 (Nice to have):**
9. Reviews e ratings
10. Wishlist
11. Recomendações por IA

### Timeline Estimada
- MVP: 3-4 semanas
- Com admin: 4-5 semanas
- Completo: 6-8 semanas
