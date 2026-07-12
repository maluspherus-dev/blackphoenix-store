# BlackPhoenix Store

## 🔥 Plataforma Premium de Anúncios com Painel Administrativo

Uma plataforma completa para gerenciamento de anúncios com sistema de avaliações, painel administrativo intuitivo e integração de pagamentos via Mercado Pago (PIX e Cartão de Crédito).

## ✨ Funcionalidades

### Para Usuários
- ✅ Registro e Login seguro com JWT
- ✅ Visualizar anúncios por categoria
- ✅ Sistema de avaliação de produtos
- ✅ Realizar pagamentos via PIX ou Cartão

### Para Admin (você)
- 📊 Dashboard com estatísticas em tempo real
- 📢 Criar, editar e deletar anúncios
- 📁 Gerenciar categorias
- ⭐ Moderar avaliações (remover as injustas)
- 💳 Consultar pagamentos recebidos
- 👥 Gerenciar usuários

## 🛠️ Stack de Tecnologia

- **Backend**: Node.js + Express
- **Banco de Dados**: PostgreSQL
- **Autenticação**: JWT
- **Frontend**: HTML5, CSS3, JavaScript Vanilla
- **Pagamentos**: Mercado Pago API
- **UI/UX**: Tema Preto OLED com Azul

## 📋 Requisitos

- Node.js 14+
- PostgreSQL 12+
- npm ou yarn

## 🚀 Instalação e Setup

### 1. Clonar o repositório
```bash
git clone https://github.com/maluspherus-dev/blackphoenix-store.git
cd blackphoenix-store
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=blackphoenix_db
DB_USER=postgres
DB_PASSWORD=sua_senha

JWT_SECRET=sua_chave_jwt_super_secreta_aqui

MERCADO_PAGO_ACCESS_TOKEN=seu_token_aqui
MERCADO_PAGO_PUBLIC_KEY=sua_chave_publica_aqui

PORT=3000
NODE_ENV=development
```

### 4. Criar banco de dados
```bash
creatdb blackphoenix_db
```

### 5. Iniciar o servidor
```bash
npm start
```

Ou com nodemon para desenvolvimento:
```bash
npm run dev
```

O servidor estará rodando em `http://localhost:3000`

## 🔐 Credenciais Padrão (Admin)

- **Email**: maluspherus@gmail.com
- **Senha**: malus2161@

## 📚 API Endpoints

### Autenticação
- `POST /api/auth/registro` - Registrar novo usuário
- `POST /api/auth/login` - Fazer login

### Anúncios
- `GET /api/anuncios` - Listar anúncios públicos
- `GET /api/anuncios/:id` - Detalhes de um anúncio
- `POST /api/admin/anuncios` - Criar anúncio (admin)
- `PUT /api/admin/anuncios/:id` - Editar anúncio (admin)
- `DELETE /api/admin/anuncios/:id` - Deletar anúncio (admin)

### Categorias
- `GET /api/admin/categorias` - Listar categorias (admin)
- `POST /api/admin/categorias` - Criar categoria (admin)

### Avaliações
- `POST /api/avaliacoes` - Criar avaliação
- `GET /api/avaliacoes/anuncio/:id` - Listar avaliações de um anúncio
- `DELETE /api/avaliacoes/:id` - Remover avaliação (admin)

### Pagamentos
- `POST /api/pagamentos/criar` - Criar pagamento
- `GET /api/pagamentos` - Listar pagamentos (admin)

### Admin
- `GET /api/admin/dashboard` - Dashboard com estatísticas

## 🎨 Design

- **Tema**: Preto OLED (#0a0e27)
- **Cor Secundária**: Azul (#0066ff)
- **Responsivo**: Mobile, Tablet e Desktop
- **Transições Suaves**: Hover effects e animações

## 💳 Integração Mercado Pago

A integração com Mercado Pago permite:
- ✅ Receber pagamentos via PIX
- ✅ Aceitar Cartão de Crédito
- ✅ Webhooks para confirmação de pagamento
- ✅ Segurança e conformidade com PCI

**Setup**:
1. Criar conta em [Mercado Pago](https://www.mercadopago.com.br)
2. Gerar Access Token e Public Key
3. Adicionar ao arquivo `.env`

## 📦 Estrutura do Projeto

```
blackphoenix-store/
├── config/
│   └── database.js
├── middleware/
│   └── auth.js
├── routes/
│   ├── auth.js
│   ├── admin.js
│   ├── anuncios.js
│   ├── avaliacoes.js
│   └── pagamentos.js
├── public/
│   ├── index.html
│   ├── styles.css
│   └── app.js
├── .env.example
├── .gitignore
├── package.json
├── server.js
└── README.md
```

## 🤝 Contribuir

Este é um projeto pessoal, mas sugestões são bem-vindas!

## 📄 Licença

ISC

## 👨‍💻 Autor

**maluspherus-dev**
- GitHub: [@maluspherus-dev](https://github.com/maluspherus-dev)

---

**🔥 BlackPhoenix Store - Sua Plataforma Premium de Anúncios**
