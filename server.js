const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const db = require('./config/database');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const anunciosRoutes = require('./routes/anuncios');
const avaliacoesRoutes = require('./routes/avaliacoes');
const pagamentosRoutes = require('./routes/pagamentos');

const app = express();

// Middleware de segurança
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Inicializar banco de dados
db.initialize().catch(err => {
  console.error('Erro ao conectar ao banco:', err);
  process.exit(1);
});

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/anuncios', anunciosRoutes);
app.use('/api/avaliacoes', avaliacoesRoutes);
app.use('/api/pagamentos', pagamentosRoutes);

// Rota raiz
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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
