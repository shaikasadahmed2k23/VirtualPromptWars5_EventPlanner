# Deploying Utsav to Cloud Run

The production container serves the built SPA and Express `/api` from one
Cloud Run service. It defaults to demo AI mode when no Gemini key is supplied.

## Deploy from source

From the repository root, authenticate with Google Cloud and select a project:

```sh
gcloud auth login
gcloud config set project PROJECT_ID
```

Deploy with Cloud Run building the `Dockerfile`:

```sh
gcloud run deploy utsav \
  --source . \
  --region REGION \
  --allow-unauthenticated \
  --set-env-vars NODE_ENV=production,GEMINI_MODEL=gemini-3.8-flash \
  --set-env-vars GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

For a private service, omit `--allow-unauthenticated`. Keep the API key out of
source control; Secret Manager is recommended for production:

```sh
gcloud run deploy utsav \
  --source . \
  --region REGION \
  --set-env-vars NODE_ENV=production,GEMINI_MODEL=gemini-3.8-flash \
  --set-secrets GEMINI_API_KEY=gemini-api-key:latest
```

Cloud Run supplies `PORT` (normally `8080`). The server reads `PORT`,
`GEMINI_API_KEY`, `GEMINI_MODEL`, and the optional comma-separated
`ALLOWED_ORIGIN` directly from the container environment. Leave
`ALLOWED_ORIGIN` unset for same-origin SPA/API requests; additional origins can
be supplied when a separate frontend needs API access.

## Local container check

```sh
docker build -t utsav .
docker run --rm -p 8080:8080 -e GEMINI_MODEL=gemini-3.8-flash utsav
```

Then open `http://localhost:8080` and check `http://localhost:8080/api/health`.
