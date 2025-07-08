import express from 'express';
import fastaaRoutes from './routes/fastaa.js';
import swaggerUi from 'swagger-ui-express';
import YAML from 'yamljs';

const app = express();
const port = process.env.PORT || 3001;

// JSON parsing (if you add POST later)
app.use(express.json());

// Pilot routes
app.use('/api/fastaa', fastaaRoutes);

// OpenAPI docs
const spec = YAML.load('./docs/openapi.yaml');
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec));

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(port, () => {
  console.log(`Backend listening on http://localhost:${port}`);
});

