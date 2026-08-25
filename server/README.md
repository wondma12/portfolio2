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

Create a Neon project, open its SQL Editor, and run `database/database.sql`. Copy Neon’s pooled connection string into Render’s `DATABASE_URL` variable; it should include `sslmode=require`. Also set `JWT_SECRET` and `CLIENT_URL` in Render. Do not commit `.env` or production credentials.
