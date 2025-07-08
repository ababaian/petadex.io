# `/backend` – Express API

The backend is a lightweight **Node18 / Express 4** service exposing a REST API to the `fastaa` table in the `petadex` PostgreSQL database.

---

## Folder structure

```
backend/
├── src/
│   ├── app.js            # Express app (exported)
│   ├── index.js          # Local runner (node src/index.js)
│   ├── db.js             # pg connection pool
│   ├── routes/
│   │   └── fastaa.js     # /api/fastaa routes
│   └── docs/openapi.yaml # OpenAPI 3 spec (served at /docs)
├── tests/                # Jest integration tests
├── .env.example          # sample environment vars
└── package.json          # scripts & deps
```

---

## Environment variables

| Variable  | Description                                                       |
| --------- | ----------------------------------------------------------------- |
| `DB_HOST` | RDS endpoint (e.g. `petadex.xxxxxxx.us-east-1.rds.amazonaws.com`) |
| `DB_PORT` | 5432                                                              |
| `DB_NAME` | **petadex**                                                       |
| `DB_USER` | RDS username                                                      |
| `DB_PASS` | RDS password                                                      |
| `DB_PORT` | Local listen port (default `3001`)                                |

---

## Scripts

```bash
# install deps
npm ci

# dev mode w/ nodemon
npm run dev

# production (used by PM2)
npm start

# lint & test
npm run lint
npm test

# create enviornmental variable
# and populate the file (values on AWS Secrets)
cp .env.example .env
```

---

## PM2 & Systemd (production on EC2)

```bash
pm2 start src/index.js --name petadex-backend
pm2 save
pm2 startup systemd -u ec2-user --hp /home/ec2-user
```
---

## API endpoints

| Method | Path                     | Description                                   |
| ------ | ------------------------ | --------------------------------------------- |
| GET    | `/api/fastaa`            | list all sequences                            |
| GET    | `/api/fastaa/:accession` | fetch a single sequence                       |
| POST   | `/api/fastaa`            | insert (JSON body: `{ accession, sequence }`) |

See interactive docs at `` (Swagger UI).

---

## Deployment summary

1. CI pushes to `main` trigger **backend-deploy.yml**.
2. GitHub Actions SSH to EC2 (`appleboy/ssh-action`) -> `git pull && npm ci && pm2 restart`.
3. NGINX (port 443) proxies `/api/` → `http://localhost:3001/api/`.
