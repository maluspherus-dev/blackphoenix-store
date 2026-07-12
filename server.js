const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar banco de dados (opcional no inicio)
let db = null;
if (process.env.NODE_ENV === 'production') {
  db = require('./config/database');
  db.initialize().catch(err => {
    console.error('Aviso: Erro ao conectar ao banco:', err.message);
  });
}

// Rotas
app.use('/api/auth', require('./routes/auth'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/anuncios', require('./routes/anuncios'));
app.use('/api/avaliacoes', require('./routes/avaliacoes'));
app.use('/api/pagamentos', require('./routes/pagamentos'));

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error(err);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.log(`📦 Ambiente: ${process.env.NODE_ENV}`);
});
