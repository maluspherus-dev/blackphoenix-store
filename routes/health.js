const express = require('express');
const router = express.Router();

// Placeholder - rota simples
router.get('/health', (req, res) => {
  res.json({ status: 'API funcionando' });
});

module.exports = router;
