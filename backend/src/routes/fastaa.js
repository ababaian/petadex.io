// backend/src/routes/fastaa.js
import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../db.js';

const router = Router();
const schema = Joi.string().max(64).required();

// GET all sequences
router.get('/', async (req, res, next) => {
  try {
    const { rows } = await pool.query(
      'SELECT accession, sequence, created_at FROM fastaa ORDER BY id'
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
});

// GET by accession
router.get('/:accession', async (req, res, next) => {
  const { error, value } = schema.validate(req.params.accession);
  if (error) return res.status(400).json({ error: error.message });

  try {
    const { rows } = await pool.query(
      'SELECT accession, sequence, created_at FROM fastaa WHERE accession = $1',
      [value]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
});

export default router;

