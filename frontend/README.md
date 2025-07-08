# `/frontend` – Gatsby static site

The UI is a **Gatsby** SPA that consumes the backend API and renders `petadex`

---

## Directory layout

```
frontend/
├── src/
│   ├── pages/
│   │   ├── index.js      # landing page
│   │   ├── fastaa.js     # list of sequences
│   │   └── protein.js    # dropdown lookup + SequenceViewer
│   ├── components/
│   │   └── SequenceViewer.js
│   └── images/           # static assets
├── static/CNAME          # “petadex.net” – copied to public/
├── gatsby-config.js      # siteMetadata, plugins
├── package.json          # scripts & deps
└── .env.example          # sample env
```

---

## Key env variable

| Variable         | Meaning                                                  |
| ---------------- | -------------------------------------------------------- |
| `GATSBY_API_URL` | Base URL of backend (e.g. `https://api.petadex.net/api`) |

During CI the value is injected from GitHub Secret.

---

## Dev commands

```bash
npm ci                 # install deps
npm run develop        # gatsby dev at http://localhost:8000
npm run lint           # eslint + prettier
npm run build          # production build → public/
```

### Local `.env` examples

```
# .env.development
GATSBY_API_URL=http://localhost:3001/api

# .env.production (optional local build)
GATSBY_API_URL=https://api.petadex.net/api
```

---

## Deployment flow

1. Push to `main` triggers `frontend-ci-deploy.yml`.
2. GitHub Actions:
   - Injects `GATSBY_API_URL`
   - Runs `gatsby build`
   - Uploads `public/` artifact
   - Deploys to GitHub Pages (branch: `gh-pages`)
3. `static/CNAME` ensures `petadex.net` custom domain.
