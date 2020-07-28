const express = require('express');
const router = express.Router();

const Lumary = require('../models/lumary');

router.get('/', (req, res) => res.json({ ok: 'usa' }));

router.post('/lumary', (req, res) => {
  const { device, state } = req.body;
  const d = Lumary.get(device);
  d.turn(state);
  res.json({ ...d.toJSON() });
});

module.exports = router;
