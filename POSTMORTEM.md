# POSTMORTEM

## Overview

This project extended a functional backend into a multi-tenant, audit-aware, workflow-driven system with production-oriented safeguards.

The primary goal was to demonstrate architectural thinking under time constraints.

---

## What Went Well

### 1. Tenant Isolation

- Clean `tenant_id` strategy
- Strict enforcement at service layer
- Cross-tenant access rejection
- Isolation verified with tests

This created a strong security foundation.

---

### 2. Audit Discipline

- Correlation ID middleware implemented
- Before/after state captured
- Metadata included consistently
- Clear audit traceability

Matches aviation-grade trace expectations.

---

### 3. Workflow Correctness

- Explicit state transitions
- Controlled mutation flow
- Escalation automation
- Safe retry logic

Prevents inconsistent booking states.

---

### 4. Deployment Readiness

- Fully containerized
- Environment separation
- CI blocks regressions
- Migration safety enforced

---

## Challenges Faced

- Prisma initialization timing with DB container
- Ensuring all queries were tenant-scoped
- Avoiding cross-tenant data leakage
- Designing workflow escalation safely
- Balancing scope vs depth

---

## Key Lessons

- Tenant isolation must be enforced at backend layer — never trust frontend.
- Audit logging should be systematic, not ad-hoc.
- Workflow systems require strict state guards.
- CI discipline prevents silent regressions.
- Clear trade-offs are better than incomplete perfection.

---

## If Given More Time

- Redis-based distributed caching
- Dead-letter queue for failed jobs
- Structured monitoring stack
- OpenTelemetry tracing
- More integration test coverage
- Infrastructure as Code (Terraform)

---

## Reflection

The system balances:

- Security
- Auditability
- Performance awareness
- Deployment readiness
- Practical time management

The implementation prioritizes correctness and architectural clarity over feature volume.

This mirrors real-world production trade-offs.