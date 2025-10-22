## PETadex.io [Under construction]

PETadex.io is an open‑source platform for exploring plastic‑degrading enzymes. The repository has two‑tiers

```
petadex.io/
├── backend/     - Node/Express API (PostgreSQL – fastaa table)
├── frontend/    - Gatsby static site (served by GitHub Pages)
├── .github/     - Workflows & AI helpers
└── docs/        - OpenAPI spec & misc assets
```

### Local quick start (development server)
#### clone & enter repo
 `git clone https://github.com/ababaian/petadex.io.git && cd petadex.io`

#### backend → http://localhost:3001
``` 
 cd backend && cp .env.example .env  # fill in DB creds
 npm ci && npm run dev
```

#### frontend → http://localhost:8000
```
 <!-- Do the following in new terminal  -->
 cd ../frontend && npm ci
 npm run develop
```

### Production architecture
```
┌───────────────┐        HTTPS           ┌────────────────┐       TCP 5432      ┌───────────────┐
│  GitHub Pages │     petadex.net    ─▶  │  NGINX @ EC2   │  ──►   AWS RDS      │ PostgreSQL DB │
│  (Gatsby)     │                        │ api.petadex.net│                     │   petadex     │
└───────────────┘                        └────────────────┘                     └───────────────┘
                                              │
                                              └─> PM2‑managed Node/Express (backend/)

```
- **GitHub Pages** hosts the static site built from `/frontend`.
- **EC2** runs NGINX which terminates SSL (`/etc/letsencrypt/live/api.petadex.net/*`) and proxies `/api/*` to the Express server on port 3001.
- **PostgreSQL RDS** stores enzyme sequences (`fastaa` table) and future datasets.

#### CI/CD overview

| Workflow                   | Path                | Purpose                                                                            |
| -------------------------- | ------------------- | ---------------------------------------------------------------------------------- |
| **frontend-ci-deploy.yml** | `.github/workflows` | Builds Gatsby from `/frontend`, injects `GATSBY_API_URL`, deploys to GitHub Pages. |
| **backend-deploy.yml**     | `.github/workflows` | SSHes into EC2, pulls latest `/backend` code, `npm ci`, `pm2 restart`.             |

All sensitive values (DB creds, API URL, EC2 SSH key) live in **GitHub Secrets**.

### Contributing
PETadex community — feel free to open issues & PRs!

1. Fork & branch from `main`.
2. Run `npm run lint` in both sub‑projects.
3. Add or update unit tests (`backend/tests`, `frontend/src/__tests__`).
4. PR → CI must pass.


