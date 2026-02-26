# ARCHITECTURE

## 1. Overview

This system extends Level 1 into a production-oriented, multi-tenant backend designed for aviation-grade workflow discipline.

Core goals:
- Strict tenant isolation
- Audit-grade logging
- Workflow-driven scheduling
- Performance-aware API design
- Cloud-ready deployment

---

## 2. Multi-Tenancy Strategy

### Chosen Approach:
Shared Database + `tenant_id` column (Row-Level Isolation)

### Why This Approach?

- Simpler operational overhead
- Single migration pipeline
- Easier scaling
- Clear logical separation
- Suitable for moderate tenant count

### Enforcement Strategy

- Every multi-tenant table includes:
  - `tenant_id` (indexed)
- All service-layer queries require `tenant_id`
- No raw global queries allowed
- Tenant ID derived from authenticated user context
- Backend validates tenant ownership before any mutation

### Security Guarantee

Even if the frontend is tampered:
- Cross-tenant access is rejected at backend level
- Service methods validate tenant before returning data

---

## 3. Data Model Extensions

### Added Fields
- `tenant_id` on all domain tables
- Audit log table
- Workflow status enum

### Indexing Strategy

Indexes added on:
- `tenant_id` (all tenant-scoped tables)
- `status` (workflow queries)
- `created_at` (sorting & pagination)
- Foreign keys (joins & relations)

Reason:
Improve read-heavy performance and scoped filtering efficiency.

---

## 4. Audit Logging (Aviation-Grade Discipline)

### Tracked Events

- User login
- Course create/update
- Booking create/approve/assign
- Role changes

### Audit Log Schema

Fields:
- `id`
- `user_id`
- `tenant_id`
- `action`
- `before_state` (JSON)
- `after_state` (JSON)
- `correlation_id`
- `timestamp`

### Implementation

- Correlation ID middleware attaches unique request ID
- Service-layer hooks capture before/after states
- Logs stored persistently in DB
- All critical mutations generate audit entry

---

## 5. Workflow Engine

### Booking Lifecycle

```bash
requested → approved → assigned → completed
```

### Rules

- Only valid transitions allowed
- Instructor assignment required before completion
- Admin escalation if instructor not assigned within configured time window

### Automation

- Background job runner monitors unassigned bookings
- Escalation logged
- Email notification stub implemented (console log)

### Retry Handling

- Background jobs configured with safe retry
- Idempotent logic prevents duplicate side effects

---

## 6. Background Processing

Tool: Lightweight job runner (e.g., BullMQ / Cron)

Responsibilities:
- Escalation checks
- Time-based workflow automation

Design:
- Isolated worker process
- Safe retry configuration
- Failure logging

---

## 7. Performance & Scalability

### Caching

- Read-heavy endpoints cached
- TTL-based invalidation
- Designed to be swappable with Redis

### Pagination

All list endpoints:
- page
- limit
- metadata response (total, page count)

Prevents unbounded queries.

### Rate Limiting

Applied to:
- Auth endpoints
- Booking endpoints

Prevents brute-force and abuse.

---

## 8. API Protection Strategy

- JWT authentication
- Role-based access
- Tenant enforcement
- Rate limiting
- Input validation

---

## 9. Environment Separation

Config supports:
- Development
- Staging
- Production

Each environment:
- Separate DB
- Separate secrets
- Independent deployment pipeline

---

## 10. Design Philosophy

This system prioritizes:

- Correctness over complexity
- Isolation over convenience
- Auditability over speed
- Clear trade-offs over over-engineering

The implementation balances production discipline with practical time constraints.