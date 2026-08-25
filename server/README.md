## Run locally

```bash
npm install
npm start
```

## Render deployment

The repository includes a `render.yaml` blueprint with separate API and frontend services. The frontend uses `client` as its service root, so Render runs the build where `client/package.json` exists.

If the services were created manually, set the API service to:

- Root Directory: `server`
- Build Command: `npm ci`
- Start Command: `npm start`
- Health Check Path: `/health`

Set the frontend service to:

- Root Directory: `client`
- Build Command: `npm ci && npm run build`
- Publish Directory: `dist`

Add `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`, and `CLIENT_URL` as Render environment variables. Do not commit `.env` or production credentials.
