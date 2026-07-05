# Aegis Bank Web Client Portal

This is the responsive, modern web portal client for the Aegis Secure Banking Platform. Built using **Next.js 15**, React, TailwindCSS, and SWR, it connects to the core banking API and features a custom Security Control panel.

---

## Prerequisites
Ensure you have the following installed locally:
- **Node.js 18+** (Recommended: LTS version 20+)
- **NPM** (comes with Node) or **Yarn**

---

## Running the Web Portal (Direct / Host Mode)

### 1. Install Dependencies
Navigate to the `FE_Web` folder and install packages:
```bash
cd FE_Web
npm install
```

### 2. Start Dev Server
Start the local development server:
```bash
npm run dev
```
Open **`http://localhost:3000`** in your browser to view the portal.

### 3. Build & Start in Production Mode
Compile the application into static files and a optimized standalone Node server:
```bash
# Build
npm run build

# Start production server
npm run start
```

---

## Reverse Proxy and Gateway Routing

By default, the Next.js portal is configured with dev rewrites inside [next.config.ts](file:///d:/hackathon/FE_Web/next.config.ts) to forward backend requests:
- `/api-bank/:path*` -> Proxies to Java Backend (`http://localhost:8080`)
- `/api/:path*` -> Proxies to Go SOC Backend (`http://localhost:8082`)
- `/soc/:path*` -> Proxies to React SOC Dashboard (`http://localhost:3001`)

If you are running the unified docker-compose environment, all requests are handled directly by **Nginx on port 80** and Next.js acts as a regular client.

---

## Containerized Deployment (Docker)

To compile and run Next.js inside a hardened production container:

### 1. Build the Docker Image
```bash
docker build -t aegis-bank-frontend .
```

### 2. Run the Container
```bash
docker run -d -p 3000:3000 --name aegis-frontend-service aegis-bank-frontend
```
The container is configured as a standalone Next.js server, exposing port `3000`.
