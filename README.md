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

---

## Security Hardening and Mitigations

* **HSTS & Permissions-Policy**: Added Strict-Transport-Security and Permissions-Policy headers to secure browser interactions and satisfy compliance audits.
* **Fingerprint Elimination**: Disabled the `X-Powered-By: Next.js` header in the custom Next.js server configuration to minimize server fingerprinting disclosure.
* **Component Resiliency**: Implemented a global React `ErrorBoundary` page to gracefully handle runtime render exceptions without revealing stack traces.
* **Vulnerability Defenses**: Strengthened transaction tables and user profile views against Stored XSS reflection and customer details information leakage.

---

## Tech Stack

| Component | Version |
|---|---|
| Next.js | 16.2.10 |
| React | 19.2.4 |
| TypeScript | 5 |
| TailwindCSS | v4 |
| Axios | 1.18.1 |
| SWR | 2.4.2 |
| Testing | Jest 30.4.2 |
| Docker | node:20-alpine multi-stage |

---

## Deployment Info

In the full ecosystem, this service runs as the `fe-web` container on port 3000. Nginx routes all `/` requests to this service. See [aegis-bank-deployment](https://github.com/Little-Boy-s-Aegis/aegis-bank-deployment) for the full Docker Compose setup.

---

## Related Repositories

| Repository | Description |
|---|---|
| [aegis-bank-deployment](https://github.com/Little-Boy-s-Aegis/aegis-bank-deployment) | Docker Compose orchestration |
| [aegis-bank-backend](https://github.com/Little-Boy-s-Aegis/aegis-bank-backend) | Spring Boot banking API |
| [aegis-bank-mobile-app](https://github.com/Little-Boy-s-Aegis/aegis-bank-mobile-app) | Flutter mobile app |
| [dashboard](https://github.com/Little-Boy-s-Aegis/dashboard) | SOC Dashboard - Go backend + React frontend |
| [agent-layer-1](https://github.com/Little-Boy-s-Aegis/agent-layer-1) | AI Sensor Agents |
| [agent-layer-2](https://github.com/Little-Boy-s-Aegis/agent-layer-2) | Meta Analyzer / SOAR Orchestrator prompts |
| [aegis-soar-engine](https://github.com/Little-Boy-s-Aegis/aegis-soar-engine) | SOAR Decision Engine |
| [aegis-staging-sandbox](https://github.com/Little-Boy-s-Aegis/aegis-staging-sandbox) | Staging Sandbox |
| [aegis-bank-terraform](https://github.com/Little-Boy-s-Aegis/aegis-bank-terraform) | Terraform IaC |
