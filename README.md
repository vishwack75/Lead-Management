# Installation 

## Prerequisites
- **Node.js**: v18.x or higher

- **npm** or **yarn**

---

## 1. Clone the Repository
```bash
git clone <repository-url>
cd Lead-Management
```

---

## 2. Server Setup (Backend)

1. Navigate to the `server` directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create the environment file:
   ```bash
   cp .env.example .env
   ```

   *(On Windows PowerShell, use: `copy .env.example .env`)*

4. Configure `.env` (ensure MongoDB is running):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/lead_management
   NODE_ENV=development
   ```

5. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server runs on: `http://localhost:5000`*

---

## 3. Client Setup (Frontend)

1. Open a new terminal and navigate to the `client` directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the frontend development server:
   ```bash
   npm run dev
   ```
   *The client runs on: `http://localhost:5173`*

---


