# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

PETadex.io is a full-stack platform for exploring plastic-degrading enzymes (PETases). It's a monorepo with:
- **Frontend**: Gatsby 5 static site (React 18) deployed to GitHub Pages
- **Backend**: Express API server on EC2 with PostgreSQL database (AWS RDS)

## Development Commands

### Backend (Node/Express API)
```bash
cd backend
npm ci                    # Install dependencies
npm run dev              # Start dev server with nodemon (port 3001)
npm run start            # Start production server
npm test                 # Run tests
```

**Environment Setup**: Copy `.env.example` to `.env` and fill in database credentials:
```
DB_HOST=<postgres-host>
DB_PORT=5432
DB_NAME=petadex
DB_USER=<db-user>
DB_PASS=<db-password>
PORT=3001
```

### Frontend (Gatsby)
```bash
cd frontend
npm ci                    # Install dependencies
npm run develop          # Dev server (http://localhost:8000)
npm run build            # Production build
npm run serve            # Serve production build locally
npm run clean            # Clear Gatsby cache
npm run format           # Format with Prettier
```

**API URL Configuration** (Required):
- Create `frontend/.env.development` with `GATSBY_API_URL=http://localhost:3001/api`
- See `frontend/.env.example` for template
- Configuration is centralized in `frontend/src/config.js`
- Production uses `GATSBY_API_URL=https://api.petadex.net/api` (set via CI/CD)

## Architecture

### Request Flow
```
User Browser → GitHub Pages (Static Gatsby) → CORS Request → EC2/NGINX → Express API (port 3001) → PostgreSQL RDS
```

### Backend API Structure

**Route Organization** (`backend/src/routes/`):
- Each route is a separate file exporting an Express Router
- All routes mounted under `/api/*` prefix
- Input validation using Joi schemas
- Raw SQL queries via `pg` connection pool (no ORM)

**Key Endpoints**:
- `/api/fastaa` - Amino acid sequences
- `/api/fastaa/:accession` - Single sequence by accession ID
- `/api/gene-metadata` - Gene information and experimental data
- `/api/plate-data` - Experimental measurements
- `/api/aa-seq-features/:accession` - Calculated sequence features (mass, pI, hydropathy)
- `/api/gene-details/:accession/header` - Quick stats for sequence pages
- `/api/pdb/accession/:accession` - Protein structure (PDB) data
- `/health` - Health check endpoint
- `/docs` - Swagger UI (OpenAPI spec)

**CORS Configuration**: Whitelist in `backend/src/app.js` includes:
- `https://petadex.net`
- `http://localhost:8000` (dev)
- `http://localhost:9000` (serve)

### Frontend Architecture

**Page Generation Strategy** (`gatsby-node.js`):
1. Creates client-only route fallback for `/sequence/*`
2. At build time, fetches all sequences from API
3. Pre-renders individual pages for each sequence at `/sequence/{accession}`
4. Gracefully degrades to client-side rendering if API unavailable during build

**Component Structure**:
- **Pages** (`src/pages/`): Static routes (index, fastaa, 404)
- **Templates** (`src/templates/`): Dynamic sequence detail pages
- **Components** (`src/components/`):
  - `DataViewer` - Tab-based container (Sequence, Structure, Metadata)
  - `SequencePanel` - Amino acid sequence display
  - `StructurePanel` - 3D protein viewer (uses 3Dmol library)
  - `MetadataPanel` - Sequence metadata display
  - `SynthesizedGenePanel` - Gene experiments with Recharts visualization
  - `ProteinViewer` - 3Dmol wrapper for PDB structures
  - `FeaturedPETases` - Highlighted sequences on main page
  - `SequenceViewer` - Reusable sequence renderer

**Styling**: Inline CSS-in-JS (object styles) - no separate CSS files except `layout.css`

### Database Schema (PostgreSQL)

**Core Tables**:

1. **fastaa** - Amino acid sequences
   - Primary key: `accession` (UniProt/NCBI accession)
   - Contains: `aa_sequence`, `source`, `synonyms`, `date_entered`, `in_gene_metadata`

2. **gene_metadata** - Synthesized genes
   - Primary key: `gene`
   - Foreign key: `accession` → fastaa
   - Contains: `nickname`, `orf_nt_sequence`, homology arms, batch info

3. **plate_data** - Experimental measurements
   - Foreign key: `gene` → gene_metadata
   - Contains: plate/well position, `readout_value`, `measurement_type`, `normalization_method`

4. **plate_metadata** - Experiment parameters
   - Primary key: `plate`
   - Contains: temperature, pH, timepoint, media, organism

5. **aa_seq_features** - Calculated properties
   - Primary key: `accession`
   - Contains arrays: `mass`, `pi`, `hpath`, plus `sequence_length`

6. **pdb_accessions** - 3D structures
   - Primary key: `pdb_id`
   - Foreign key: `accession` → fastaa
   - Contains: structure technique, relaxation status, alignment data

7. **with_sra_and_biosample_loc_metadata** - SRA metadata
   - Contains: origin country, biome, organism, geographic location (PostGIS geometry)

**Query Pattern**: All database access uses parameterized queries via `pg.Pool`:
```javascript
const { rows } = await pool.query('SELECT * FROM fastaa WHERE accession = $1', [value]);
```

## Important Patterns

### Data Fetching in Frontend

Sequence detail pages (`templates/sequence.js`) follow this pattern:
1. Check if data available from `pageContext` (pre-rendered)
2. If not, extract accession from URL path
3. Fetch sequence from `/api/fastaa/{accession}`
4. Fetch related data in parallel:
   - Gene metadata: `/api/gene-metadata/by-accession/{accession}`
   - Header data: `/api/gene-details/{accession}/header`
   - Sequence features: `/api/aa-seq-features/{accession}`
5. For each gene in metadata, fetch plate data: `/api/plate-data/gene/{geneId}/average`

### Error Handling

**Backend**: Global error middleware catches all errors and returns 500
**Frontend**: Component-level error states with try-catch in useEffect

### Input Validation

Use Joi schemas for all user input:
```javascript
const schema = Joi.string().max(64).required();
const { error, value } = schema.validate(req.params.accession);
if (error) return res.status(400).json({ error: error.message });
```

## Deployment

### CI/CD Workflows

**Frontend** (`.github/workflows/frontend-ci-deploy.yml`):
- Triggered on: push to main, manual dispatch
- Steps: checkout → setup Node → restore Gatsby cache → build → deploy to GitHub Pages
- Uses GitHub Secrets: `GATSBY_API_URL`

**Backend** (`.github/workflows/backend-ci-deploy.yml`):
- Triggered on: manual dispatch only
- Steps: build/test → SSH to EC2 → pull code → npm ci (production) → PM2 restart
- Uses GitHub Secrets: SSH credentials, DB credentials

### Production Infrastructure

- **Frontend**: GitHub Pages at petadex.net
- **Backend**: EC2 (Ubuntu) with NGINX reverse proxy at api.petadex.net
  - NGINX terminates SSL (Let's Encrypt)
  - Proxies `/api/*` to Express on port 3001
  - PM2 manages Node process
- **Database**: AWS RDS PostgreSQL with PostGIS extension

## Common Tasks

### Adding a New API Endpoint

1. Create route file in `backend/src/routes/` exporting a Router
2. Add route to `backend/src/app.js`:
   ```javascript
   import myRoutes from './routes/myRoutes.js';
   app.use('/api/my-endpoint', myRoutes);
   ```
3. Update `backend/docs/openapi.yaml` with endpoint documentation

### Adding a New Frontend Component

1. Create component in `frontend/src/components/MyComponent.js`
2. Use inline styles (object notation)
3. Import and use in page/template:
   ```javascript
   import MyComponent from "../components/MyComponent";
   ```

### Querying the Database

Access the connection pool from any route:
```javascript
import { pool } from '../db.js';
const { rows } = await pool.query('SELECT ...', [params]);
```

### Working with 3D Structures

PDB files are loaded via `/api/pdb/accession/{accession}` which returns:
```javascript
{
  pdb_id: "7ABC",
  pdb_url: "https://petadex-pdb-files.s3.amazonaws.com/7ABC.pdb",
  technique: "X-RAY DIFFRACTION",
  // ... other metadata
}
```

The `ProteinViewer` component fetches and displays using 3Dmol library.

## Known Patterns to Follow

1. **No ORMs**: Use raw SQL with parameterized queries
2. **Inline Styles**: All React styling via style objects, not CSS files
3. **Client-Side Data**: Fetch data in useEffect hooks, not at build time (except gatsby-node)
4. **URL Patterns**: Sequence pages at `/sequence/{accession}`, not `/sequences/` or `/seq/`
5. **API Prefix**: All backend routes under `/api/` namespace
6. **CORS**: Update whitelist in `app.js` when adding new frontend domains
7. **Centralized Config**: Import `config` from `src/config.js` for API URLs - never hard-code or use `process.env` directly in components
