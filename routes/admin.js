const express = require('express');
const { verificarAdmin } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Dashboard
router.get('/dashboard', verificarAdmin, async (req, res) => {
  try {
    const anuncios = await db.query('SELECT COUNT(*) as total FROM anuncios WHERE ativo = true');
    const usuarios = await db.query('SELECT COUNT(*) as total FROM usuarios');
    const pagamentos = await db.query('SELECT SUM(valor) as total FROM pagamentos WHERE status = \'confirmado\'');
    const avaliacoes = await db.query('SELECT COUNT(*) as total FROM avaliacoes WHERE removida = false');

    res.json({
      anuncios: anuncios.rows[0].total,
      usuarios: usuarios.rows[0].total,
      pagamentos: pagamentos.rows[0].total || 0,
      avaliacoes: avaliacoes.rows[0].total
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar dashboard' });
  }
});

// Criar anúncio
router.post('/anuncios', verificarAdmin, async (req, res) => {
  try {
    const { titulo, descricao, categoria_id, preco, imagens } = req.body;

    if (!titulo || !descricao || !categoria_id || !preco) {
      return res.status(400).json({ error: 'Campos obrigatórios faltando' });
    }

    const resultado = await db.query(
      'INSERT INTO anuncios (titulo, descricao, categoria_id, preco, imagens, usuario_id, ativo) VALUES ($1, $2, $3, $4, $5, $6, true) RETURNING *',
      [titulo, descricao, categoria_id, preco, JSON.stringify(imagens || []), req.usuario.id]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar anúncio' });
  }
});

// Editar anúncio
router.put('/anuncios/:id', verificarAdmin, async (req, res) => {
  try {
    const { titulo, descricao, categoria_id, preco, ativo, imagens } = req.body;
    const { id } = req.params;

    const resultado = await db.query(
      'UPDATE anuncios SET titulo = $1, descricao = $2, categoria_id = $3, preco = $4, ativo = $5, imagens = $6, atualizado_em = CURRENT_TIMESTAMP WHERE id = $7 RETURNING *',
      [titulo, descricao, categoria_id, preco, ativo, JSON.stringify(imagens || []), id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao atualizar anúncio' });
  }
});

// Deletar anúncio
router.delete('/anuncios/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await db.query('DELETE FROM anuncios WHERE id = $1 RETURNING *', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    res.json({ message: 'Anúncio deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao deletar anúncio' });
  }
});

// Listar categorias
router.get('/categorias', verificarAdmin, async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM categorias WHERE ativo = true');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar categorias' });
  }
});

// Criar categoria
router.post('/categorias', verificarAdmin, async (req, res) => {
  try {
    const { nome, descricao } = req.body;

    if (!nome) {
      return res.status(400).json({ error: 'Nome é obrigatório' });
    }

    const resultado = await db.query(
      'INSERT INTO categorias (nome, descricao, ativo) VALUES ($1, $2, true) RETURNING *',
      [nome, descricao]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar categoria' });
  }
});

// Listar todos os anúncios
router.get('/anuncios', verificarAdmin, async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM anuncios ORDER BY criado_em DESC');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
});

module.exports = router;
