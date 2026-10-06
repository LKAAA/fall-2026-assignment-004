---
name: erd-generator
description: Converts domain requirements and specifications into verified Mermaid Entity-Relationship Diagrams (erDiagram) and compiles visual SVG assets. Trigger when asked to design an ERD, data model, database schema, or architecture diagram.
---

# ERD Generator Skill

This skill translates domain requirements into deterministic, syntax-validated Mermaid Entity-Relationship Diagrams (`erDiagram`) and compiles them into visual SVG assets.

## Workflow

1. **Domain Requirements Parsing:**
   - Identify entities, attributes, primary keys (`PK`), foreign keys (`FK`), and unique constraints.
   - Clarify domain and business decisions (e.g. cardholder profile vs user account, 1:1 vs 1:N cardinality).
   - Use standard Mermaid ER types (`serial`, `varchar`, `integer`, `timestamp`, `text`, `boolean`).

2. **Draft Diagram to File:**
   - Write the valid Mermaid ERD definition directly to `docs/architecture/schema.mmd`.
   - Ensure Mermaid syntax conforms to `erDiagram` rules:
     ```mermaid
     erDiagram
         ENTITY_NAME {
             type field PK
             type foreign_id FK
             type field
         }
         PARENT ||--o{ CHILD : "relates"
     ```

3. **Validation & Asset Compilation:**
   - Execute the validation renderer script:
     ```bash
     node scripts/render_erd.js docs/architecture/schema.mmd
     ```
     (or `node .agent/skills/erd-generator/scripts/render_erd.js docs/architecture/schema.mmd`)
   - The script uses `mmdc` (`@mermaid-js/mermaid-cli`) to compile `docs/architecture/erd.svg`.

4. **Self-Correction Loop:**
   - If the script outputs `SYNTAX_ERROR:`, capture and inspect the stderr stack trace.
   - Identify offending lines or invalid syntax tokens (e.g., unsupported brackets, invalid relationship indicators, unmatched quotes).
   - Revise `docs/architecture/schema.mmd` and re-run the compiler script.
   - Retry up to 3 times until the script outputs `SUCCESS` with exit code 0.

5. **Final Output:**
   - Display the raw Mermaid code block in the response.
   - State the explicit business decisions made.
   - Reference the compiled visual asset path: `docs/architecture/erd.svg`.
