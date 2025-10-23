// backend/src/routes/plateData.js
import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../db.js';

const router = Router();
const schema = Joi.string().max(64).required();

// GET average readout for a specific gene
router.get('/gene/:gene/average', async (req, res, next) => {
  console.log('API request received for gene plate data:', req.params.gene);
  const { error, value } = schema.validate(req.params.gene);
  if (error) {
    console.log('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        AVG(readout_value) as average_readout,
        COUNT(*) as sample_count,
        measurement_type
      FROM plate_data 
      WHERE gene = $1 AND readout_value IS NOT NULL
      GROUP BY measurement_type`,
      [value]
    );
    
    console.log('Query result:', rows.length ? 'Found' : 'Not found');
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    
    // If there's only one measurement type, return that directly
    // Otherwise return the first one (or you could return all)
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    next(err);
  }
});

// GET all plate data for a gene
router.get('/gene/:gene', async (req, res, next) => {
  console.log('API request received for gene plate data:', req.params.gene);
  const { error, value } = schema.validate(req.params.gene);
  if (error) {
    console.log('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        id,
        gene,
        plate,
        plasmid,
        column,
        row,
        normalization_method,
        readout_value,
        colony_size,
        date_entered,
        measurement_type
      FROM plate_data 
      WHERE gene = $1
      ORDER BY plate, row, column`,
      [value]
    );
    
    console.log('Query result:', rows.length, 'records found');
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    next(err);
  }
});

export default router;