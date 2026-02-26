# Skynet Multi-Tenant Ops – Backend

Production-oriented, multi-tenant aviation operations backend built with NestJS, Prisma, PostgreSQL, and Docker.

This project extends a Level 1 system into an institutional-grade architecture with:

- Strict tenant isolation
- Audit-grade logging
- Workflow-driven scheduling
- Background automation
- Performance optimizations
- CI/CD discipline
- Cloud-ready deployment

---

## 1. Tech Stack

- Node.js 20
- NestJS
- Prisma ORM
- PostgreSQL 16
- Docker & Docker Compose
- JWT Authentication
- Background Job Runner
- Rate Limiting
- Pagination
- TTL Caching

---

## 2. Core Features

### Multi-Tenancy (Hard-Enforced)

- Shared database with `tenant_id` row isolation
- All queries scoped to tenant
- Cross-tenant access rejected at backend layer
- Tenant isolation verified with test cases

---

### Audit Logging (Aviation Discipline)

All critical actions are logged:

- User login
- Course creation/update
- Booking state transitions
- Role changes

Each audit log contains:
- `user_id`
- `tenant_id`
- `before_state`
- `after_state`
- `timestamp`
- `correlation_id`

---

### Workflow Engine

Booking lifecycle:

```bash
requested → approved → assigned → completed
```

Automation:
- Escalation if instructor not assigned within configured time
- Background job runner with retry handling
- Email notification stub (console-based)

---

### Performance & Protection

- DB indexing for tenant and status queries
- Pagination on all list endpoints
- Rate limiting on auth and booking endpoints
- TTL-based caching for read-heavy routes

---

## 3. Project Structure

```bash
airman-core/
│
├── backend/
│ ├── src/
│ ├── prisma/
│ ├── Dockerfile
│ └── package.json
│
├── docker-compose.yml
├── ARCHITECTURE.md
├── DEPLOYMENT.md
├── PLAN.md
├── CUTS.md
├── POSTMORTEM.md
└── README.md
```

---

## 4. Running Locally (Without Docker)

### 1. Install dependencies

```bash
cd backend
npn install
```

### 2. Configure environment

Create `.env` file:

```bash
DATABASE_URL = postgresql://postgres:postgres@localhost:5432/airman_core
JWT_SECRET=supersecret
```

### 3. Run Migration

```bash
npx prisma migrate dev
```

### 4. Start Server

```bash
npm run start:dev
```

Server runs at
```json
http://localhost:3000
```

---

## 5. Running with Docker (Recommended)

From root directory:

```bash
docker compose up --build
```

Services:
- Backend → http://localhost:3000
- PostgreSQL → port 5432

To stop:

```bash
docker compose down -v
```

---

## 6. Running Tests

```bash
npm run test
```

Includes:
- Unit tests
- Tenant isolation checks
- Workflow validation

---

## 7. CI/CD

Pipeline includes:
- Lint
- Unit tests
- Integration tests with DB container
- Migration validation
- Build step
- Coverage threshold enforcement

CI blocks regressions.

---

## 8. Deployment

Containerized deployment supported on:
- Render
- Fly.io
- Railway
- AWS / GCP

Environment separation:
- Dev
- Staging
- Production

Secrets managed via cloud environment variables.

See `DEPLOYMENT.md` for full details.

---

## 9. Security Model

- JWT authentication
- Role-based access
- Tenant enforcement at service layer
- Rate limiting
- Input validation
- Audit trail for traceability

---

## 10. Acceptance Criteria Coverage

✔ Tenant isolation verified  
✔ Audit logs contain correct metadata  
✔ Background jobs retry safely  
✔ Rate limiting prevents abuse  
✔ Cloud deployment supported  
✔ CI blocks regressions  

---

## 11. Trade-Offs

To keep the solution practical within time constraints:
- Shared DB multi-tenancy chosen
- Console stub for email notifications
- Basic retry strategy
- Lightweight caching layer
- Simplified monitoring

Full reasoning documented in:
- PLAN.md
- CUTS.md
- POSTMORTEM.md

---

## 12. Design Philosophy

This implementation focuses on:
- Isolation over convenience
- Auditability over shortcuts
- Correct workflow transitions
- Practical production readiness
- Clear trade-offs

The system is structured to scale with minimal architectural change.

---

## Author

Arshath Farwyz  
AI Engineer | AI Full Stack Engineer