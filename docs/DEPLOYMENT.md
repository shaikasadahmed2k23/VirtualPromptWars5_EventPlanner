# Deployment

Utsav ships as **one container**: Express serves the built SPA and the `/api`
routes from the same origin, so there is no CORS setup and the Gemini key never
leaves the server.

The live demo runs on **Render**: https://virtualpromptwars5-eventplanner.onrender.com

## Render (the live deployment)

1. In Render, create a **Web Service** from this GitHub repository and choose
   the **Docker** runtime. Render builds the root `Dockerfile`.
2. Set the environment variables (Settings → Environment):

   | Variable         | Value                                                          |
   | ---------------- | -------------------------------------------------------------- |
   | `GEMINI_API_KEY` | Your Gemini key. Leave unset to run in labelled demo mode.     |
   | `GEMINI_MODEL`   | Optional. Defaults to `gemini-3.8-flash`.                      |
   | `ALLOWED_ORIGIN` | Optional. Only needed if a different origin must call the API. |

   Render injects `PORT`; the server reads it. Do not set `NODE_ENV` (the image
   already sets `production`).

3. Set **Health Check Path** to `/api/health`. It returns
   `{ "status": "ok", "aiMode": "live" | "demo" }`, never the key or model.
4. Leave **Auto-Deploy** on: every push to `main` rebuilds and redeploys.
   CI (`.github/workflows/ci.yml`) runs the same checks on every push.

On the free tier the service sleeps when idle, so the first request after a
while takes around 30 seconds.

### What the container does

- **Multi-stage build:** dependencies and the build run in the first stage. The
  runtime stage installs production dependencies only (`npm ci --omit=dev`), so
  dev tooling is never shipped.
- Runs as the unprivileged `node` user, with a Docker `HEALTHCHECK` on
  `/api/health`.
- Starts with `node` directly rather than `npm`, so `SIGTERM` reaches the
  server and it shuts down gracefully when Render replaces the instance.
- Trusts one proxy hop (`trust proxy = 1`), which gives the rate limiter real
  client IPs behind Render's load balancer.

## Check the image locally

```sh
docker build -t utsav .
docker run --rm -p 8080:8080 -e GEMINI_API_KEY=your-key utsav   # omit the key for demo mode
```

Open http://localhost:8080 and http://localhost:8080/api/health.

## Other hosts

Any platform that runs a Dockerfile and injects `PORT` works the same way. On
Google Cloud Run, for example, run `gcloud run deploy utsav --source .` and keep
the key in Secret Manager (`--set-secrets GEMINI_API_KEY=gemini-api-key:latest`).
