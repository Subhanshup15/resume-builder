# Resume Backend — Quick setup

Steps to run the backend locally (Windows PowerShell):

1. Copy the example env and edit values:

```powershell
cd D:\xampp\htdocs\Project\resume-builder\resume-backend
cp .env.example .env
# then open .env and set MONGO_URI and GEMINI_API_KEY
```

2. Install dependencies:

```powershell
npm install
```

3. Start the server (development):

```powershell
npm run dev
```

4. API endpoints:

- `GET /` — root health check
- `POST /api/resume` — save resume
- `GET /api/resume/:userId` — get resume
- `PUT /api/resume/:userId` — update resume
- `POST /api/optimize` — optimize resume using Gemini (requires `GEMINI_API_KEY`)

Notes:
- The server defaults to port `5000` if `PORT` is not provided.
- If `MONGO_URI` is not set the backend runs in an in-memory fallback mode so resume save/get/update endpoints still work during local development (data is lost when the server stops).
- If `GEMINI_API_KEY` is not set the `/api/optimize` endpoint uses a simple local formatting fallback so you can test optimization without an external API.
