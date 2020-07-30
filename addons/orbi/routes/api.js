const express = require('express');
const router = express.Router();

const Floors = require('../models/orbi');

router.get('/floor/:floorName', (req, res) => {
  const { floorName } = req.params;
  const occupied = Floors[floorName].isOccupied();
  res.json({ occupied });
});

module.exports = router;
