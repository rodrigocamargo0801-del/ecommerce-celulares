# Schema do Banco de Dados (JSON)

## Header
Estrutura completa dos arquivos JSON que armazenam os dados do e-commerce. Inclui produtos, usuários e pedidos.

---

## Main

### 1. products.json
```json
{
  "products": [
    {
      "id": "001",
      "nome": "iPhone 15 Pro",
      "marca": "Apple",
      "preco": 4999.00,
      "desconto": 0,
      "descricao": "Smartphone topo de linha com chip A17 Pro",
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
      "criado_em": "2024-01-15"
    },
    {
      "id": "002",
      "nome": "Samsung Galaxy S24",
      "marca": "Samsung",
      "preco": 4499.00,
      "desconto": 10,
      "descricao": "Flagship Samsung com IA avançada",
      "especificacoes": {
        "tela": "6.2 polegadas AMOLED",
        "processador": "Snapdragon 8 Gen 3",
        "camera": "50MP",
        "memoria": "12GB",
        "armazenamento": "256GB",
        "bateria": "4000mAh",
        "so": "Android 14"
      },
      "estoque": 75,
      "imagem": "/assets/images/samsung/galaxys24.jpg",
      "rating": 4.6,
      "criado_em": "2024-01-10"
    }
  ]
}
```

### 2. users.json
```json
{
  "users": [
    {
      "id": "user001",
      "nome": "João Silva",
      "email": "joao@email.com",
      "senha": "$2b$10$...", // bcrypt hash
      "telefone": "(11) 98765-4321",
      "endereco": {
        "rua": "Rua A",
        "numero": "123",
        "complemento": "Apt 101",
        "cidade": "São Paulo",
        "estado": "SP",
        "cep": "01234-567"
      },
      "tipo": "cliente",
      "criado_em": "2024-01-01",
      "atualizado_em": "2024-01-15"
    },
    {
      "id": "user002",
      "nome": "Rodrigo Camargo",
      "email": "rodrigocamargo0801@gmail.com",
      "senha": "$2b$10$...",
      "tipo": "admin",
      "criado_em": "2024-01-01"
    }
  ]
}
```

### 3. orders.json
```json
{
  "orders": [
    {
      "id": "order001",
      "usuario_id": "user001",
      "data": "2024-01-15",
      "status": "confirmado", // pendente, confirmado, enviado, entregue, cancelado
      "produtos": [
        {
          "produto_id": "001",
          "nome": "iPhone 15 Pro",
          "preco_unitario": 4999.00,
          "quantidade": 1,
          "subtotal": 4999.00
        }
      ],
      "subtotal": 4999.00,
      "taxa_envio": 50.00,
      "total": 5049.00,
      "pagamento": {
        "metodo": "cartao", // cartao, pix, boleto
        "status": "pago", // pendente, pago, falhou
        "stripe_id": "pi_1234567890",
        "data_pagamento": "2024-01-15"
      },
      "endereco_entrega": {
        "rua": "Rua A",
        "numero": "123",
        "complemento": "Apt 101",
        "cidade": "São Paulo",
        "estado": "SP",
        "cep": "01234-567"
      },
      "email_enviado": true,
      "observacoes": ""
    }
  ]
}
```

### 4. carrinho.json (localStorage)
```json
{
  "cartItems": [
    {
      "produto_id": "001",
      "nome": "iPhone 15 Pro",
      "preco": 4999.00,
      "quantidade": 1,
      "imagem": "/assets/images/iphone/iphone15pro.jpg"
    }
  ],
  "usuario_id": "user001",
  "data_criacao": "2024-01-15"
}
```

---

## Footer

### Notas Importantes
- IDs gerados como UUID ou timestamp
- Senhas sempre em hash (bcrypt)
- Datas em formato ISO 8601
- Preços com 2 casas decimais
- Status em enum (strings predefinidas)
- Carrinho armazenado em localStorage do navegador

### Estrutura de Pastas para JSON
```
backend/data/
├── products.json
├── users.json
└── orders.json
```
