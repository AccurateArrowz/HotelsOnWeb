# Backend Decisions

## Why SQL over NoSQL

### Key Reasons

- **Foreign Key Integrity** — Relationships between entities (e.g., a booking must reference a valid room, a room must reference a valid hotel) are enforced at the database level, preventing corrupt or orphaned data.
- **ACID Transactions** — Booking operations require atomicity; a booking should either complete fully or not at all. SQL databases guarantee this out of the box.
- **Complex Queries** — SQL's JOIN support makes it straightforward to query across related entities without duplicating data across documents, which is a common workaround in NoSQL.
- **Data Integrity at Scale** — Schema constraints (NOT NULL, UNIQUE, FOREIGN KEY) ensure data validity is enforced at the database level, not just in application code.

