const express = require('express');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Criar avaliação
router.post('/', verificarToken, async (req, res) => {
  try {
    const { anuncio_id, nota, comentario } = req.body;

    if (!anuncio_id || !nota || nota < 1 || nota > 5) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }

    const resultado = await db.query(
      'INSERT INTO avaliacoes (anuncio_id, usuario_id, nota, comentario) VALUES ($1, $2, $3, $4) RETURNING *',
      [anuncio_id, req.usuario.id, nota, comentario]
    );

    res.status(201).json(resultado.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar avaliação' });
  }
});

// Listar avaliações de um anúncio
router.get('/anuncio/:anuncio_id', async (req, res) => {
  try {
    const { anuncio_id } = req.params;

    const resultado = await db.query(
      'SELECT * FROM avaliacoes WHERE anuncio_id = $1 AND removida = false ORDER BY criada_em DESC',
      [anuncio_id]
    );

    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar avaliações' });
  }
});

// Remover avaliação (apenas admin)
router.delete('/:id', verificarAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const { motivo_remocao } = req.body;

    const resultado = await db.query(
      'UPDATE avaliacoes SET removida = true, motivo_remocao = $1 WHERE id = $2 RETURNING *',
      [motivo_remocao, id]
    );

    if (resultado.rows.length === 0) {
      return res.status(404).json({ error: 'Avaliação não encontrada' });
    }

    res.json({ message: 'Avaliação removida com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao remover avaliação' });
  }
});

module.exports = router;
