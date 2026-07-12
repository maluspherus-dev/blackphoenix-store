const express = require('express');
const db = require('../config/database');

const router = express.Router();

// Listar anúncios públicos
router.get('/', async (req, res) => {
  try {
    const { categoria } = req.query;

    let query = 'SELECT * FROM anuncios WHERE ativo = true';
    const params = [];

    if (categoria) {
      query += ' AND categoria_id = $1';
      params.push(categoria);
    }

    query += ' ORDER BY criado_em DESC';

    const resultado = await db.query(query, params);
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar anúncios' });
  }
});

// Buscar anúncio por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const resultado = await db.query('SELECT * FROM anuncios WHERE id = $1 AND ativo = true', [id]);

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    res.json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar anúncio' });
  }
});

module.exports = router;
