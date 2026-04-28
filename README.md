# music-app-backend

Backend API scaffold for music recording upload and analysis.

## Run

- `npm run dev` - start with nodemon
- `npm run start` - start with node

## Endpoints

- `GET /` - basic app status
- `GET /api/health` - health check
- `POST /api/upload` - upload audio file (`audio` field)
- `POST /api/analysis` - upload and run placeholder analysis (`audio` field)
