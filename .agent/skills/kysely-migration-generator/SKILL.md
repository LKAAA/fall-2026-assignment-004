---
name: kysely-migration-generator
description: Parses a Mermaid ERD (from docs/architecture/schema.mmd or docs/architecture/erd.svg) and generates a type-safe Kysely database migration script in src/db/migrations/. Trigger when asked to generate database migrations, translate Mermaid ERDs to SQL/Kysely schemas, or create Kysely migrations.
---

# Kysely Migration Generator Skill

This skill parses a compiled Mermaid ERD asset (`docs/architecture/schema.mmd`) and translates it into a type-safe, production-ready Kysely migration file inside `src/db/migrations/`.

## Translation Mapping Guardrails

1. **Entities to Tables:**
   - Map uppercase Mermaid entities to lowercase `snake_case` table names (e.g., `USERS` -> `users`, `BORROWERS` -> `borrowers`, `BOOKS` -> `books`).
   - If a table already exists in a previous migration (e.g., `users` in `001_initial_schema.ts`), do not recreate it; only reference it in foreign keys or alter if requested.

2. **Keys & Columns:**
   - **Primary Keys (`PK`):**
     - Map `serial id PK` or `integer id PK` to `.addColumn('id', 'serial', (col) => col.primaryKey())`.
     - Map UUID PKs to `.addColumn('id', 'uuid', (col) => col.primaryKey().defaultTo(sql\`gen_random_uuid()\`))`.
   - **Foreign Keys (`FK`):**
     - Map foreign keys to `.addColumn('<ref_id>', 'integer', (col) => col.references('<target_table>.id').onDelete('cascade').notNull())`.
   - **Data Types:**
     - `varchar` -> `'varchar(255)'`
     - `text` -> `'text'`
     - `integer` -> `'integer'`
     - `serial` -> `'serial'`
     - `timestamp` -> `'timestamp'` (with `.defaultTo(sql\`NOW()\`)` where appropriate)
     - `boolean` -> `'boolean'`

3. **Cardinality Mapping:**
   - **One-to-Many (`||--o{`):** The child table contains the foreign key column referencing the parent table's primary key.
   - **One-to-One (`||--o|`):** The referencing child table contains the foreign key column with `.references(...).unique()`.

4. **File Output Structure:**
   - Generate file at `src/db/migrations/<timestamp>_<migration_name>.ts` (e.g., `src/db/migrations/002_library_management_schema.ts` or `<epoch_ms>_<name>.ts`).
   - Import Kysely and sql:
     ```typescript
     import { Kysely, sql } from 'kysely';
     ```
   - Export both `up(db: Kysely<any>): Promise<void>` and `down(db: Kysely<any>): Promise<void>`.
   - In `down()`, tables must be dropped in **reverse dependency order** (child tables dropped before parent tables) using `await db.schema.dropTable('table_name').execute();`.

5. **Verification:**
   - Validate TypeScript compilation: `npm run build`
   - Run migrations against PostgreSQL: `npm run migrate:up`
