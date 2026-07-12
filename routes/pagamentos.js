const express = require('express');
const { verificarToken, verificarAdmin } = require('../middleware/auth');
const db = require('../config/database');

const router = express.Router();

// Criar preferência de pagamento (Mercado Pago)
router.post('/criar', verificarToken, async (req, res) => {
  try {
    const { anuncio_id } = req.body;

    // Buscar anúncio
    const anuncio = await db.query('SELECT * FROM anuncios WHERE id = $1', [anuncio_id]);
    if (anuncio.rows.length === 0) {
      return res.status(404).json({ error: 'Anúncio não encontrado' });
    }

    // Criar registro de pagamento
    const resultado = await db.query(
      'INSERT INTO pagamentos (anuncio_id, usuario_id, valor, metodo, status) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [anuncio_id, req.usuario.id, anuncio.rows[0].preco, 'mercado_pago', 'pendente']
    );

    // TODO: Integrar com Mercado Pago SDK para criar preference
    res.json({ pagamento: resultado.rows[0], mensagem: 'Integração com Mercado Pago será configurada' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar pagamento' });
  }
});

// Listar pagamentos (apenas admin)
router.get('/', verificarAdmin, async (req, res) => {
  try {
    const resultado = await db.query('SELECT * FROM pagamentos ORDER BY criado_em DESC');
    res.json(resultado.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao buscar pagamentos' });
  }
});

module.exports = router;
