# CUTS

Due to time constraints, the following were intentionally simplified:

- Used shared DB multi-tenancy instead of separate schema
- Email notifications implemented as console stub
- Used in-memory cache instead of Redis cluster
- Basic workflow engine instead of full event-driven system
- Minimal UI validation

All critical isolation and audit requirements were fully implemented.