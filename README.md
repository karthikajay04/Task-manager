# TaskFlow · a gentle task manager

TaskFlow is a full-stack task manager designed to feel like a personal paper notebook rather than a conventional dark admin dashboard. It lets people create a small account and capture, organize, complete, edit, and remove their tasks.

## What’s implemented

- Email/password registration and login, with hashed passwords and JWT sessions
- User-scoped task CRUD: create, read, edit, mark complete, and delete
- Task details: note, category, priority, and optional due date
- Filters for all, open, and completed tasks, plus completion progress
- Responsive Angular interface with a bright ruled-paper, sticky-note-inspired visual system
- Express API with Mongoose models, validation, authentication middleware, and clear route separation

## Tech stack

- **Client:** Angular 19, TypeScript, standalone components, signals, HTTP client
- **Server:** Node.js, Express, Mongoose
- **Database:** MongoDB
- **Authentication:** bcryptjs + JSON Web Tokens

## Run locally

### Prerequisites

- Node.js 20 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Configure the API

Copy `server/.env.example` to `server/.env`, then set `MONGODB_URI` and a long random `JWT_SECRET`.

### 2. Install dependencies

```bash
npm install
npm install --prefix server
npm install --prefix client
```

### 3. Start the application

In two terminals:

```bash
npm run dev --prefix server
npm start --prefix client
```

Open `http://localhost:4200`. The Angular development server proxies `/api` requests to the API at port 3000.

To create a production client build:

```bash
npm run build --prefix client
```

## API routes

| Method | Route | Description |
| --- | --- | --- |
| POST | `/api/auth/register` | Create an account |
| POST | `/api/auth/login` | Sign in |
| GET | `/api/tasks` | Get the signed-in user’s tasks |
| POST | `/api/tasks` | Create a task |
| PATCH | `/api/tasks/:id` | Update a task or its completion status |
| DELETE | `/api/tasks/:id` | Delete a task |

## AI tools used and how

I used **OpenAI Codex** as an implementation partner. It helped me scaffold the Angular and Express structure, draft the initial visual CSS direction, and spot/fix Angular build configuration and strict-template issues. I reviewed the generated code, chose the product scope and visual direction, validated the client production build, and made the integration decisions. The notebook visual language, product behavior, data model, and project structure were deliberately selected for this assignment rather than copied from a template.

## Challenges faced

- Keeping the product visually distinctive while retaining accessible form controls and responsive layouts.
- Configuring Angular’s standalone build setup from a blank repository and resolving its strict template checks.
- Managing the contrast between a playful paper aesthetic and clear task-state indicators.

## With more time

- Add automated unit/integration tests and a GitHub Actions pipeline.
- Add task search, sorting, categories managed by users, and recurring tasks.
- Add password reset, rate limiting, stronger validation, and refresh-token handling.
- Deploy the Angular app and API, use MongoDB Atlas, and add a live demo link.
- Improve accessibility further with focus trapping in the modal and a full keyboard-navigation review.

## Notes

No demo account is pre-seeded: create an account from the registration screen. This is intentional so every task collection remains associated with the authenticated user.
