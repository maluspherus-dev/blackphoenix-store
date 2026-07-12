const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Dados em memória (temporário)
const usuarios = [];
const anuncios = [];

// Rotas básicas
app.get('/', (req, res) => {
  res.json({ mensagem: '🚀 BlackPhoenix Store está ONLINE!' });
});

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date() });
});

app.get('/api/anuncios', (req, res) => {
  res.json({ anuncios: anuncios, total: anuncios.length });
});

app.post('/api/anuncios', (req, res) => {
  const anuncio = { id: Date.now(), ...req.body, criado_em: new Date() };
  anuncios.push(anuncio);
  res.status(201).json(anuncio);
});

app.get('/api/auth/login', (req, res) => {
  res.json({ message: 'API de autenticação' });
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
  console.log(`📦 Ambiente: ${process.env.NODE_ENV || 'development'}`);
  console.log(`✅ Pronto para receber requisições!`);
});
