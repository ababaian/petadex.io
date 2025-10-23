// backend/src/routes/geneDetails.js
import { Router } from 'express';
import Joi from 'joi';
import { pool } from '../db.js';

const router = Router();
const schema = Joi.string().max(64).required();

// GET header data
router.get('/:accession/header', async (req, res, next) => {
  console.log('API request received for header:', req.params.accession);
  const { error, value } = schema.validate(req.params.accession);
  if (error) {
    console.log('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        w.accession,
        w.geo_loc_name_country_calc as origin_country,
        t.temperature
      FROM with_sra_and_biosample_loc_metadata w
      LEFT JOIN with_biosample_temp_data t ON w.accession = t.accession
      WHERE w.accession = $1
      LIMIT 1`,
      [value]
    );
    console.log('Query result:', rows.length ? 'Found' : 'Not found');
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    next(err);
  }
});

// GET origin and discovery data
router.get('/:accession/origin', async (req, res, next) => {
  console.log('API request received for origin:', req.params.accession);
  const { error, value } = schema.validate(req.params.accession);
  if (error) {
    console.log('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        w.accession,
        w.geo_loc_name_country_calc as country,
        w.geo_loc_name_country_continent_calc as continent,
        w.biome,
        w.collection_date_sam as collection_date,
        w.organism as source_organism,
        w.elevation,
        ST_Y(w.lat_lon) as latitude,
        ST_X(w.lat_lon) as longitude,
        w.geo_loc_name_sam as location_name
      FROM with_sra_and_biosample_loc_metadata w
      WHERE w.accession = $1
      LIMIT 1`,
      [value]
    );
    console.log('Query result:', rows.length ? 'Found' : 'Not found');
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    next(err);
  }
});

// GET synthesized genes data
router.get('/:accession/synthesized', async (req, res, next) => {
  console.log('API request received for synthesized:', req.params.accession);
  const { error, value } = schema.validate(req.params.accession);
  if (error) {
    console.log('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        w.accession,
        w.aa_sequence,
        w.source,
        w.genotype,
        w.genotype_description,
        w.synthetic,
        w.parent_accessions,
        w.parent_genes,
        w.synonyms,
        t.temperature
      FROM with_sra_metadata w
      LEFT JOIN with_biosample_temp_data t ON w.accession = t.accession
      WHERE w.accession = $1`,
      [value]
    );
    console.log('Query result:', rows.length ? 'Found' : 'Not found');
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows);
  } catch (err) {
    console.error('Database error:', err);
    next(err);
  }
});

// GET research context data
router.get('/:accession/research', async (req, res, next) => {
  console.log('API request received for research:', req.params.accession);
  const { error, value } = schema.validate(req.params.accession);
  if (error) {
    console.log('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        w.accession,
        w.bioproject,
        w.biosample,
        w.acc as sra_accession,
        w.sra_study,
        w.releasedate as release_date,
        w.organism,
        w.biosamplemodel_sam as biosample_model
      FROM with_sra_metadata w
      WHERE w.accession = $1
      LIMIT 1`,
      [value]
    );
    console.log('Query result:', rows.length ? 'Found' : 'Not found');
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    next(err);
  }
});

// GET complete gene details (consolidated endpoint)
router.get('/:accession', async (req, res, next) => {
  console.log('API request received for complete details:', req.params.accession);
  const { error, value } = schema.validate(req.params.accession);
  if (error) {
    console.log('Validation error:', error.message);
    return res.status(400).json({ error: error.message });
  }

  try {
    const { rows } = await pool.query(
      `SELECT 
        w.accession,
        w.aa_sequence,
        w.source,
        w.genotype,
        w.genotype_description,
        w.synthetic,
        w.parent_accessions,
        w.parent_genes,
        w.synonyms,
        w.bioproject,
        w.biosample,
        w.acc as sra_accession,
        w.sra_study,
        w.releasedate as release_date,
        w.organism,
        w.biosamplemodel_sam as biosample_model,
        w.geo_loc_name_country_calc as country,
        w.geo_loc_name_country_continent_calc as continent,
        w.biome,
        w.collection_date_sam as collection_date,
        w.elevation,
        ST_Y(w.lat_lon) as latitude,
        ST_X(w.lat_lon) as longitude,
        w.geo_loc_name_sam as location_name,
        t.temperature
      FROM with_sra_and_biosample_loc_metadata w
      LEFT JOIN with_biosample_temp_data t ON w.accession = t.accession
      WHERE w.accession = $1
      LIMIT 1`,
      [value]
    );
    console.log('Query result:', rows.length ? 'Found' : 'Not found');
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Database error:', err);
    next(err);
  }
});

export default router;