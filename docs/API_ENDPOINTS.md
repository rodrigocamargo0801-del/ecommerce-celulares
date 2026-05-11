# Documentação da API

## Header
Listagem completa de todos os endpoints REST da API com métodos, parâmetros, respostas e exemplos.

---

## Main

### Autenticação

#### POST /api/auth/register
Criar nova conta de usuário

**Request:**
```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "senha123456",
  "telefone": "(11) 98765-4321"
}
```

**Response (201):**
```json
{
  "id": "user001",
  "nome": "João Silva",
  "email": "joao@email.com",
  "tipo": "cliente",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erros:**
- 400: Email já existe
- 400: Senha fraca
- 400: Dados inválidos

---

#### POST /api/auth/login
Autenticar usuário

**Request:**
```json
{
  "email": "joao@email.com",
  "senha": "senha123456"
}
```

**Response (200):**
```json
{
  "id": "user001",
  "nome": "João Silva",
  "email": "joao@email.com",
  "tipo": "cliente",
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

**Erros:**
- 401: Credenciais inválidas
- 404: Usuário não encontrado

---

#### POST /api/auth/logout
Logout do usuário

**Header Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensagem": "Logout realizado com sucesso"
}
```

---

### Produtos

#### GET /api/products
Listar todos os produtos com filtros opcionais

**Query Parameters:**
- `busca` (string): Buscar por nome ou marca
- `marca` (string): Filtrar por marca
- `preço_min` (number): Preço mínimo
- `preço_max` (number): Preço máximo
- `ordenar` (string): preço_asc, preço_desc, popular
- `pagina` (number): Página (padrão: 1)
- `limite` (number): Itens por página (padrão: 12)

**Exemplos:**
```
GET /api/products
GET /api/products?marca=Apple&preço_max=5000
GET /api/products?busca=iPhone&ordenar=preço_asc
```

**Response (200):**
```json
{
  "total": 45,
  "pagina": 1,
  "limite": 12,
  "produtos": [
    {
      "id": "001",
      "nome": "iPhone 15 Pro",
      "marca": "Apple",
      "preco": 4999.00,
      "desconto": 0,
      "imagem": "/assets/images/iphone/iphone15pro.jpg",
      "rating": 4.8,
      "estoque": 50
    }
  ]
}
```

---

#### GET /api/products/:id
Obter detalhes completo de um produto

**Response (200):**
```json
{
  "id": "001",
  "nome": "iPhone 15 Pro",
  "marca": "Apple",
  "preco": 4999.00,
  "desconto": 0,
  "descricao": "Smartphone topo de linha",
  "especificacoes": {
    "tela": "6.1 polegadas",
    "processador": "Apple A17 Pro",
    "camera": "48MP",
    "memoria": "8GB",
    "armazenamento": "256GB",
    "bateria": "3322mAh",
    "so": "iOS 17"
  },
  "estoque": 50,
  "imagem": "/assets/images/iphone/iphone15pro.jpg",
  "rating": 4.8,
  "avaliações": [
    {
      "usuario": "João Silva",
      "rating": 5,
      "comentario": "Excelente produto!"
    }
  ]
}
```

**Erros:**
- 404: Produto não encontrado

---

#### POST /api/products (Admin)
Criar novo produto

**Header Required:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "nome": "Samsung Galaxy S24",
  "marca": "Samsung",
  "preco": 4499.00,
  "desconto": 10,
  "descricao": "Flagship Samsung",
  "especificacoes": {...},
  "estoque": 75,
  "imagem": "/assets/images/samsung/s24.jpg"
}
```

**Response (201):**
```json
{
  "id": "002",
  "mensagem": "Produto criado com sucesso"
}
```

**Erros:**
- 401: Não autenticado
- 403: Permissão negada (não é admin)
- 400: Dados inválidos

---

#### PUT /api/products/:id (Admin)
Atualizar produto

**Header Required:**
```
Authorization: Bearer {token}
```

**Request:** (qualquer campo é opcional)
```json
{
  "nome": "Samsung Galaxy S24 Ultra",
  "estoque": 50,
  "desconto": 15
}
```

**Response (200):**
```json
{
  "id": "002",
  "mensagem": "Produto atualizado com sucesso"
}
```

---

#### DELETE /api/products/:id (Admin)
Deletar produto

**Header Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensagem": "Produto deletado com sucesso"
}
```

---

### Pedidos

#### POST /api/orders
Criar novo pedido (processar compra)

**Header Required:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "produtos": [
    {
      "produto_id": "001",
      "quantidade": 1
    },
    {
      "produto_id": "002",
      "quantidade": 2
    }
  ],
  "endereco": {
    "rua": "Rua A",
    "numero": "123",
    "complemento": "Apt 101",
    "cidade": "São Paulo",
    "estado": "SP",
    "cep": "01234-567"
  },
  "pagamento": {
    "metodo": "cartao", // cartao, pix, boleto
    "token_stripe": "tok_visa"
  }
}
```

**Response (201):**
```json
{
  "id": "order001",
  "usuario_id": "user001",
  "status": "confirmado",
  "total": 10048.00,
  "pagamento": {
    "status": "pago",
    "metodo": "cartao"
  },
  "mensagem": "Pedido confirmado! Email enviado."
}
```

**Erros:**
- 401: Não autenticado
- 400: Estoque insuficiente
- 400: Dados inválidos
- 402: Erro no pagamento

---

#### GET /api/orders (Autenticado)
Listar pedidos do usuário logado

**Header Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "total": 3,
  "pedidos": [
    {
      "id": "order001",
      "data": "2024-01-15",
      "status": "entregue",
      "total": 5049.00,
      "produtos_count": 1
    }
  ]
}
```

---

#### GET /api/orders/:id (Autenticado)
Obter detalhes de um pedido específico

**Header Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "order001",
  "usuario_id": "user001",
  "data": "2024-01-15",
  "status": "entregue",
  "produtos": [
    {
      "produto_id": "001",
      "nome": "iPhone 15 Pro",
      "quantidade": 1,
      "preco_unitario": 4999.00
    }
  ],
  "total": 5049.00,
  "endereco_entrega": {...},
  "pagamento": {...}
}
```

---

#### PUT /api/orders/:id/status (Admin)
Atualizar status do pedido

**Header Required:**
```
Authorization: Bearer {token}
```

**Request:**
```json
{
  "status": "enviado"
}
```

**Response (200):**
```json
{
  "id": "order001",
  "status": "enviado",
  "email_enviado": true,
  "mensagem": "Status atualizado e email enviado"
}
```

---

#### DELETE /api/orders/:id (Admin)
Cancelar pedido

**Header Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "mensagem": "Pedido cancelado com sucesso"
}
```

---

### Usuários

#### GET /api/users (Admin)
Listar todos os usuários

**Header Required:**
```
Authorization: Bearer {token}
```

**Query Parameters:**
- `pagina` (number): Página
- `limite` (number): Itens por página

**Response (200):**
```json
{
  "total": 25,
  "usuarios": [
    {
      "id": "user001",
      "nome": "João Silva",
      "email": "joao@email.com",
      "tipo": "cliente",
      "pedidos_count": 3
    }
  ]
}
```

---

#### GET /api/users/:id (Admin)
Obter detalhes do usuário

**Header Required:**
```
Authorization: Bearer {token}
```

**Response (200):**
```json
{
  "id": "user001",
  "nome": "João Silva",
  "email": "joao@email.com",
  "telefone": "(11) 98765-4321",
  "tipo": "cliente",
  "criado_em": "2024-01-01",
  "pedidos": [
    {
      "id": "order001",
      "data": "2024-01-15",
      "total": 5049.00
    }
  ]
}
```

---

## Footer

### Headers Necessários

Para rotas protegidas:
```
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

### Códigos de Status HTTP

- **200:** Sucesso
- **201:** Criado
- **400:** Erro de validação
- **401:** Não autenticado
- **403:** Permissão negada
- **404:** Não encontrado
- **500:** Erro do servidor

### Exemplo de Requisição (JavaScript/Axios)

```javascript
// Login
const response = await axios.post('http://localhost:3000/api/auth/login', {
  email: 'joao@email.com',
  senha: 'senha123456'
});

const token = response.data.token;
localStorage.setItem('token', token);

// Requisição com autenticação
const orders = await axios.get('http://localhost:3000/api/orders', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```
