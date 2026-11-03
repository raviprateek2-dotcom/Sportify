# SPORTIFY.LABS — High-Performance Circular Activewear Platform

> Production-ready, enterprise-grade e-commerce platform and circular gear ecosystem built for endurance mountain athletes. Powered by Next.js 14 (App Router), PostgreSQL, Prisma ORM, Tailwind CSS, and NextAuth.js.

---

## ⚡ Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: v20.x or later
- **Docker & Docker Compose** (Optional for local PostgreSQL)

### 2. Environment Setup
```bash
# Clone the repository
git clone https://github.com/your-org/sportify.git
cd Sportify

# Copy environment variables
cp .env.example .env
```

### 3. Spin Up Local Database
```bash
# Start PostgreSQL via Docker Compose
docker-compose up sportify-postgres -d
```

### 4. Install Dependencies & Seed Database
```bash
# Install npm dependencies & generate Prisma client
npm install

# Push database schema to PostgreSQL
npm run db:push

# Seed products, variants, and Digital Product Passports
npm run db:seed
```

### 5. Launch Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Pre-Configured Test Accounts

| Role | Email | Password | Unlocked Permissions |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@sportify.com` | `Sportify2026!` | Admin control plane, inventory, and order fulfillment |
| **Athlete** | `runner@trail.org` | `Sportify2026!` | Customer dashboard, saved race kits, verified passports |

---

## 🔍 Verified Digital Product Passports (DPP)
To test the real-time EU ESPR Digital Product Passport inspection and circular trade-in engine, enter:
- **`SPFY-2026-APEX-008492`**
- **`SPFY-2026-APEX-008493`**

At **[http://localhost:3000/passport](http://localhost:3000/passport)**.

---

## 🐳 Production Docker Build
```bash
# Build production multi-stage container (<120MB)
docker build -t sportify-web:latest .

# Run full stack via Docker Compose
docker-compose up --build
```
