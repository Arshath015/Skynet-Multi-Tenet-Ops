# PLAN

## Objective

Extend Level 1 into a production-grade multi-tenant system with audit logging, workflow automation, performance safeguards, and CI discipline — within constrained time.

Focus: correctness, isolation, and architectural clarity over feature depth.

---

## Architecture Decision

Multi-tenancy approach:
Shared Database + `tenant_id` row-level isolation.

Reason:
- Operational simplicity
- Single migration pipeline
- Easier deployment
- Clear logical separation

---

## Execution Breakdown

### Day 1 – Tenant Isolation & Audit Discipline

- Add `tenant_id` to all domain models
- Enforce tenant scoping in all service-layer queries
- Reject cross-tenant access at backend
- Create `audit_logs` table
- Implement correlation ID middleware
- Log critical actions (login, schedule updates, role changes)
- Write tenant isolation verification tests

Goal: Data integrity and security foundation.

---

### Day 2 – Workflow & Automation

- Implement booking lifecycle:
  requested → approved → assigned → completed
- Enforce valid state transitions
- Add background job runner
- Escalation rule if instructor unassigned
- Retry-safe automation logic
- Email notification stub (console-based)
- Add pagination to all list endpoints
- Add database indexes

Goal: Institutional-grade workflow discipline.

---

### Day 3 – Performance, DevOps & Quality

- Add rate limiting (auth & booking endpoints)
- Add TTL-based caching
- Configure CI:
  - Lint
  - Unit tests
  - Integration tests with DB
  - Build step
  - Coverage threshold
- Validate migrations in CI
- Containerize deployment
- Cloud deployment configuration
- Write documentation

Goal: Production readiness and engineering discipline.

---

## Prioritization Strategy

If time-constrained:
1. Tenant isolation
2. Audit logs
3. Workflow correctness
4. Rate limiting
5. CI
6. Deployment polish

Isolation and correctness were treated as non-negotiable.