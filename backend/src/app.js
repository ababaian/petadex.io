// backend/src/app.js
import 'dotenv/config';
import express from 'express';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

import fastaaRoutes from './routes/fastaa.js';
import { pool } from './db.js';

const app = express();

app.use(express.json());
app.use('/api/fastaa', fastaaRoutes);

// (Optional) health check route
app.get('/health', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ status: 'ok' });
  } catch {
    res.status(500).json({ status: 'error' });
  }
});

// Serve OpenAPI docs if you like
const spec = YAML.load('./docs/openapi.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;

