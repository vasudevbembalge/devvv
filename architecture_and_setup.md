# Architecture & Setup Guide

## 1. System Architecture
The application follows a standard MERN (or more specifically MEN + Vite/React) stack structure:

- **Frontend**: A React application powered by Vite. It communicates with the backend REST API via standard HTTP requests using the `fetch` API. Key features include JWT-based authentication and CSV/XLSX file uploads for lead distribution.
- **Backend**: A Node.js application built with Express.js. It manages User Authentication (JWT), Agents, and parses uploaded spreadsheets (using `multer`, `csv-parser`, and `xlsx`) to distribute leads among available agents in a round-robin fashion.
- **Database**: MongoDB handles the persistence layer, storing Users, Agents, LeadItems, and Distributions.

### Flow of Execution (Lead Distribution Example):
1. **User Action**: Authenticated user uploads a CSV/XLSX file via the Frontend Dashboard.
2. **Frontend Request**: The file is sent via `POST` as a `FormData` object to `/user/upload`.
3. **Backend Processing**: 
   - `multer` intercepts and temporarily saves the file.
   - The backend reads and parses the rows (checking for `FirstName` and `Phone`).
   - `LeadItem` records are bulk inserted into MongoDB.
   - The backend retrieves all agents and iterates over leads using a modulo operator (`idx % totalAgents`) to distribute leads sequentially (Round-Robin).
   - `Distribution` records are saved linking the agents to their assigned leads.
   - Temporary file is deleted from the server.
4. **Response**: Success status is returned to the frontend, updating the user interface.

## 2. Environment & Dependencies

### Required Software & Tools:
- **Node.js**: v18 or later (v20 is used for frontend container).
- **npm**: v9 or later (comes with Node.js).
- **MongoDB**: Local instance (v6/v7) or MongoDB Atlas cluster.
- **Docker**: For containerization (Phase 5).
- **Kubernetes (kubectl & Minikube/Docker Desktop)**: For orchestration (Phase 6/7).

### Dependencies Summary:
- **Backend**: `express`, `mongoose` (ORM), `bcrypt` & `jsonwebtoken` (Auth), `multer`, `csv-parser`, `xlsx`, `cors`, `dotenv`.
- **Frontend**: `react`, `react-dom`, `react-router-dom`, `vite` (dev server/bundler).

## 3. Setup Instructions (Local Development without Docker)

### Step 1: Environment Variables
Create `.env` files in both directories based on the `.env.example` provided:
**Backend (`backend/.env`)**
```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017/lead_distribution
JWT_SECRET=supersecret_jwt_key
JWT_EXPIRES_IN=1h
```

**Frontend (`frontend/frontend-proj/.env`)**
```env
VITE_API_BASE=http://localhost:4000/user
```

### Step 2: Install & Run Backend
#### Windows / Linux / Mac
```bash
cd backend
npm install
npm run start (or `node index.js`)
```
*Make sure MongoDB is running locally or your URI points to an active Atlas cluster.*

### Step 3: Install & Run Frontend
#### Windows / Linux / Mac
```bash
cd frontend/frontend-proj
npm install
npm run dev
```

The frontend will be available at `http://localhost:5173`.
