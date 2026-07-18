# TaskFlow — A Personalized Ruled-Notebook Task Manager

TaskFlow is a full-stack, responsive task management application built using the modern MEAN stack (**MongoDB, Express.js, Angular 19, and Node.js**). Unlike typical dark-themed dashboard applications, TaskFlow's visual theme is inspired by a classic, friendly ruled-paper notebook with colorful sticky notes, bringing a tactile, cozy feeling to task organization.

* **Live Demo:** [https://task-manager-rho-dusky.vercel.app/](https://task-manager-rho-dusky.vercel.app/)
* **GitHub Repository:** [https://github.com/karthikajay04/Task-manager](https://github.com/karthikajay04/Task-manager)

---

## Table of Contents
1. [Key Features](#key-features)
2. [Tech Stack](#tech-stack)
3. [Project Structure](#project-structure)
4. [Setup & Installation Instructions](#setup--installation-instructions)
5. [API Endpoints](#api-endpoints)
6. [AI Tools Used & Collaboration Breakdown](#ai-tools-used--collaboration-breakdown)
7. [Challenges Faced & Solutions](#challenges-faced--solutions)
8. [Future Roadmap & Potential Improvements](#future-roadmap--potential-improvements)

---

## Key Features

### 🔐 Secure Authentication & Session Management
- **User Signup & Login:** Form validation checks on fields (email format, password length).
- **Password Safety:** Hashing performed server-side using `bcryptjs` before storage in MongoDB.
- **Session Tokens:** Stateless `JSON Web Tokens (JWT)` stored securely on the client and appended automatically to server requests via an Angular HTTP Interceptor.
- **Protected Routes:** Unauthorized users are redirected away from the dashboard using Angular `AuthGuard` guards.

### 📝 Scoped CRUD Operations
- **Create:** Add tasks with a title, priority level (Low, Medium, High), category tag (Work, Personal, Ideas, Shopping, etc.), optional due date, and detailed description/notes.
- **Read:** Instantly view user-specific tasks from MongoDB. Supports custom filters: *All Tasks*, *Open Tasks*, and *Completed Tasks*. Includes a dynamic completion progress tracker.
- **Update:** Inline editing for task details and instant toggling of completion status (marked done).
- **Delete:** Safely remove tasks via visual trash controls.

### 🎨 Premium Ruled-Paper Theme & Responsive UI
- **Tactile Notebook Aesthetic:** Emulates ruled blue-and-pink lined paper backgrounds, clean typography (using Google Fonts), and colorful sticky notes.
- **Fluid Layouts:** Entirely responsive CSS rules designed from scratch. Adapts dynamically to desktop, tablet, and mobile device screens.
- **Dynamic Micro-animations:** Hover transitions, active state translations, and button scale effects provide premium feedback.

---

## Tech Stack

| Layer | Technology | Details |
| --- | --- | --- |
| **Frontend** | Angular 19 | Standalone components, Signals for state tracking, TypeScript, Angular Router, HttpClient |
| **Backend** | Node.js + Express.js | Modular router, CORS handling, custom JWT verification middleware, JSON body parsing |
| **Database** | MongoDB | Mongoose schemas, indexes for performance, user reference bindings |
| **Security** | JSON Web Tokens & Bcryptjs | Signed tokens (JWT), bcrypt encryption for passwords |

---

## Project Structure

```text
task-manager/
├── client/                      # Angular 19 Frontend Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/            # Core singleton services and interceptors
│   │   │   │   ├── auth.guard.ts       # Guards dashboard access
│   │   │   │   ├── auth.interceptor.ts # Injects JWT headers into HTTP requests
│   │   │   │   ├── auth.service.ts     # Handles login/register API calls and token storage
│   │   │   │   ├── task.service.ts     # Handles Task CRUD API transactions
│   │   │   │   └── models.ts           # Shared TypeScript interfaces
│   │   │   ├── features/        # Feature modules
│   │   │   │   ├── auth/               # Login & Register standalone component
│   │   │   │   └── dashboard/          # Task CRUD dashboard component
│   │   │   ├── app.component.ts        # Root layout wrapper
│   │   │   └── app.routes.ts           # Client routes definitions
│   │   ├── index.html           # Main template
│   │   ├── main.ts              # Angular bootstrap entrypoint
│   │   └── styles.css           # Hand-crafted CSS variables & layout design
│   ├── package.json             # Frontend dependency configuration
│   └── proxy.conf.json          # Development proxy server configuration
│
├── server/                      # Express.js REST API Backend
│   ├── src/
│   │   ├── middleware/          # Express request validation & security
│   │   │   └── auth.middleware.js # Decodes and validates JWT token in headers
│   │   ├── models/              # MongoDB Mongoose database schemas
│   │   │   ├── User.js          # User model (encapsulates password hashing methods)
│   │   │   └── Task.js          # Task model (scopes tasks to owner ObjectId)
│   │   ├── routes/              # Express API route grouping
│   │   │   ├── auth.routes.js   # Login and registration controllers
│   │   │   └── task.routes.js   # CRUD controllers with JWT protection
│   │   └── server.js            # Node backend app bootstrap & MongoDB connection
│   ├── .env                     # Local environment configurations (ignored in git)
│   ├── .env.example             # Example environment reference
│   └── package.json             # Backend dependency configurations
│
├── package.json                 # Project root package settings (concurrently controls)
└── README.md                    # Detailed documentation
```

---

## Setup & Installation Instructions

### Prerequisites
Make sure you have the following installed locally on your system:
- **Node.js** (v20 or higher recommended)
- **npm** (v10 or higher)
- **MongoDB** (running locally on port `27017` or an active MongoDB Atlas cloud connection URI)

---

### Step 1: Clone the Repository
Clone the directory and enter the root project folder:
```bash
git clone <repository-url>
cd task-manager
```

---

### Step 2: Configure Environment Variables
1. Navigate to the `server` directory.
2. Duplicate the `.env.example` file and rename it to `.env`:
   ```bash
   cp server/.env.example server/.env
   ```
3. Open `server/.env` and update the values to match your local setup:
   ```env
   PORT=3000
   MONGODB_URI=mongodb://127.0.0.1:27017/taskflow
   JWT_SECRET=your-randomly-generated-strong-secret-key
   ```

---

### Step 3: Install Dependencies
Run the installation command in the root directory. This will set up dependencies for the root coordinator, server API, and client Angular project:
```bash
npm install
npm run install:all
```
*(Alternatively, you can manually run `npm install` inside both the `/client` and `/server` subfolders).*

---

### Step 4: Run the Application Locally

#### Bypassing Execution Policy on Windows PowerShell (Important)
If you are on Windows and experience errors running PowerShell scripts (like `npm.ps1`), bypass the restriction using command prompt wrappers:
```bash
cmd.exe /c "set NG_CLI_ANALYTICS=false && npm start"
```
Or set environment variables explicitly in PowerShell before launching:
```powershell
$env:NG_CLI_ANALYTICS="false"
npm start
```

This root command launches the client and server concurrently:
- **Backend Server:** Runs on [http://localhost:3000](http://localhost:3000)
- **Frontend Client:** Runs on [http://localhost:4200](http://localhost:4200)

Open your web browser and navigate to `http://localhost:4200`.

---

### Step 5: Build for Production
To build a optimized, minified production package of the Angular application:
```bash
npm run build --prefix client
```
The output files will be compiled and stored inside `/client/dist/taskflow-client`.

---

## API Endpoints

All backend routes are prefix-scoped with `/api`. Request bodies must be submitted in JSON format, and calls to protected routes must include the authorization header: `Authorization: Bearer <jwt-token>`.

### Authentication Routes (`/api/auth`)
| Method | Route | Description | Request Body Payload |
| --- | --- | --- | --- |
| **POST** | `/api/auth/register` | Create a new user account | `{ "email": "user@example.com", "password": "securepassword" }` |
| **POST** | `/api/auth/login` | Login and receive JWT token | `{ "email": "user@example.com", "password": "securepassword" }` |

### Task CRUD Routes (`/api/tasks`)
All task endpoints are protected by the JWT authentication middleware.
| Method | Route | Description | Request Body Payload / Path Parameters |
| --- | --- | --- | --- |
| **GET** | `/api/tasks` | Get all tasks for the logged-in user | None |
| **POST** | `/api/tasks` | Create a new task | `{ "title": "My Task", "notes": "Details...", "priority": "Medium", "category": "Work", "dueDate": "2026-07-25" }` |
| **PATCH** | `/api/tasks/:id` | Update specific task details or completion status | `{ "title": "Updated Title", "completed": true }` |
| **DELETE** | `/api/tasks/:id` | Remove a task permanently | `:id` (MongoDB ObjectId in request path) |

---

## AI Tools Used & Collaboration Breakdown

This project was built leveraging modern AI assistants. The relationship was collaborative—combining AI's speed in generating boilerplate with developer oversight, architectural decisions, and troubleshooting skills.

### 🛠️ AI Tools Utilized:
- **Google Gemini** (via Antigravity assistant)
- **OpenAI Codex**

### 🤖 Where AI Assisted:
1. **Boilerplate Generation:** Helped scaffold basic Angular standalone files, service frameworks, and simple Express handlers.
2. **CSS Layout Rules:** Generated base stylesheet selectors for the card layouts, helping speed up styling iteration.
3. **TypeScript Definitions:** Created initial mappings for interfaces, including user profiles and task statuses.
4. **Build Optimization:** Assisted in mapping configurations for proxy options (`proxy.conf.json`) during frontend-to-backend routing setup.

### 👤 What I Implemented & Managed:
1. **Security & Session Architecture:** Handled auth middleware logic. Integrated JSON Web Tokens client-side using Angular's HttpInterceptor to ensure auth headers propagate automatically to endpoints.
2. **Context-Aware Scoping:** Programmed database endpoints so MongoDB Mongoose operations check and scope query operations strictly to the authenticated `req.user.id`.
3. **PowerShell execution workarounds:** Patched local development run blockages stemming from Windows Script Execution policies.
4. **Form & Data Model Curation:** Defined data validation rules (password complexity checks, category models, and priority thresholds).
5. **Quality Verification & Testing:** Monitored terminal outputs, inspected log files, and performed visual inspections to ensure the application rendered properly across viewports.

---

## Challenges Faced & Solutions

### 1. PowerShell Script Execution Restrictions on Windows
- **Challenge:** Running `npm start` in PowerShell failed because execution of external scripts (`npm.ps1`) was blocked by OS execution policies.
- **Solution:** Re-routed execution via standard command prompt command line wrappers (`cmd.exe /c "set NG_CLI_ANALYTICS=false && npm start"`) to bypass script execution boundaries safely.

### 2. Angular Standalone CLI Interactive Prompts
- **Challenge:** Angular CLI would occasionally block process startup in headless/non-interactive terminals by asking for permission to collect anonymous analytics metrics.
- **Solution:** Injected the environment variable `NG_CLI_ANALYTICS=false` directly into the startup command string to skip interactive queries.

### 3. Asymmetric User Tasks Leaks
- **Challenge:** Ensuring tasks were securely linked to individual users. Without proper checks, users could potentially see or modify other users' tasks.
- **Solution:** Configured JWT authentication middleware in Express to verify tokens and attach user info to `req.user`. Updated all server query pipelines in `task.routes.js` to strictly match tasks with `{ owner: req.user.id }`.

---

## Future Roadmap & Potential Improvements

If I had additional time to develop TaskFlow, I would introduce the following enhancements:

- [ ] **Collaborative Task Boards (WebSockets):** Support real-time team collaboration and joint task boards using `Socket.io`.
- [ ] **OAuth 2.0 Integration:** Add social login features (Log in with Google, GitHub, and Apple).
- [ ] **Custom Tag/Category Management:** Enable users to define their own notebook categories, change category marker colors, and attach multiple tags to a single task.
- [ ] **Advanced Searching & Sorting:** Include text search across task names/notes, sorting by due dates, priority level sorting, and grouping views.
- [ ] **Recurring Tasks & Reminders:** Set up scheduled cron engines to renew periodic tasks (e.g. daily, weekly) and push browser notifications.
- [ ] **Robust Test Coverage:** Write unit testing suites for core Angular services using Jasmine and backend API routers using Supertest. Build End-to-End tests using Playwright.
- [ ] **CI/CD Integration:** Set up GitHub Actions workflow pipelines to automate lint checks, test suites, and build artifact delivery.
