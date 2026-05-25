# AI-garden-System

**Web Application to Support Image Analysis with AI Computer Vision in a Microservice Model**

A web application for image and video analysis using AI computer vision.
The system acts as a central hub that registers multiple AI vision models
(deployed separately as microservices) and lets users access them through
one unified UI with auth and permission management — so users don't have
to call each microservice endpoint directly.

The UI is designed to be friendly for non-technical users, and supports
common computer vision tasks such as object detection, segmentation, and
classification on both images and videos.

Built as a senior project at KMITL (team project), used in real lab
experiments by AI research students.

## Tech stack

**Frontend**
- React 18 + TypeScript + Vite
- MUI + Ant Design (mixed — whichever has the better component for the case)
- TailwindCSS
- TanStack Query (React Query) for data fetching
- React Router v6
- React Hook Form + Zod for form validation
- TinyMCE for the document editor

**Backend**
- NestJS 10 + TypeScript
- TypeORM + PostgreSQL 17
- Passport (Google OAuth20 + JWT strategy)
- Multer for file uploads

**Deploy / Infra**
- Docker Compose (separate files for dev / prod)
- Nginx as reverse proxy in prod

## Project structure

```
.
├── nest-backend/         # NestJS API (port 3000)
│   └── src/
│       ├── auth/         # Google OAuth + JWT
│       ├── ai/           # AI model registry + predict proxy
│       ├── ai-setting/   # usage limit / visibility guards
│       ├── permission/   # admin approves user access to AI
│       ├── workspaces/   # workspace + members
│       ├── projects/     # project inside workspace
│       ├── user/
│       ├── docs/         # document editor
│       └── note_history/
│
├── ReactFrontend/        # React + Vite (port 5173)
│   └── src/
│       ├── pages/        # main pages grouped by feature
│       ├── components/
│       ├── api/          # axios + endpoint definitions
│       ├── hook/         # TanStack Query hooks
│       └── ...
│
├── docker-compose.dev.yml
├── docker-compose.prod.yml
└── .env.example
```

## Setup

### Prerequisites

- Docker + Docker Compose
- If running locally without Docker: Node 18+ and PostgreSQL 17
- Google OAuth Client ID + Secret
  (create one at [Google Cloud Console](https://console.cloud.google.com/apis/credentials))

### 1. Clone the repo

```bash
git clone https://github.com/aumputthipong/AI-garden-System.git
cd AI-garden-System
```

### 2. Configure environment variables

**Root** (used by docker-compose):

```bash
cp .env.example .env
```

Edit `.env`:

```
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<your password>
POSTGRES_DB=ai_garden_db
```

**Backend** — create `nest-backend/.env`:

```
POSTGRES_HOST=db
POSTGRES_PORT=5432
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<same as root>
POSTGRES_DATABASE=ai_garden_db

GOOGLE_CLIENT_ID=<from Google Cloud Console>
GOOGLE_SECRET=<from Google Cloud Console>

JWT_SECRET=<long random string>
INVITE_SECRET=<long random string>
SESSION_SECRET=<long random string>

NODE_ENV=development
REACT_APP_API_URL=http://localhost:5173
NEST_APP_API_URL=http://localhost:3000
```

**Frontend** — create `ReactFrontend/.env`:

```
VITE_NEST_BACKEND_API_URL=http://localhost:3000
```

### 3. Run in dev mode with Docker

```bash
docker compose -f docker-compose.dev.yml up --build
```

The first build takes about 5 minutes because it installs dependencies
for both services.

### 4. Open the app

- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### Run without Docker (faster dev loop)

You need Postgres running locally first, then set
`POSTGRES_HOST=localhost` in `nest-backend/.env`.

```bash
# terminal 1 — backend
cd nest-backend
npm install
npm run start:dev

# terminal 2 — frontend
cd ReactFrontend
npm install
npm run dev
```
