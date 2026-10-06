import { Kysely, sql } from 'kysely';

export async function up(db: Kysely<any>): Promise<void> {
  // 1. Authors table
  await db.schema
    .createTable('authors')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('bio', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // 2. Genres table
  await db.schema
    .createTable('genres')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('name', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // 3. Borrowers table (1:1 with users)
  await db.schema
    .createTable('borrowers')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('user_id', 'integer', (col) =>
      col.references('users.id').onDelete('cascade').notNull().unique()
    )
    .addColumn('card_number', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('phone', 'varchar(255)')
    .addColumn('status', 'varchar(255)', (col) =>
      col.notNull().defaultTo('active')
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // 4. Books table
  await db.schema
    .createTable('books')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('author_id', 'integer', (col) =>
      col.references('authors.id').onDelete('cascade').notNull()
    )
    .addColumn('genre_id', 'integer', (col) =>
      col.references('genres.id').onDelete('cascade').notNull()
    )
    .addColumn('isbn', 'varchar(255)', (col) => col.notNull().unique())
    .addColumn('title', 'varchar(255)', (col) => col.notNull())
    .addColumn('description', 'text')
    .addColumn('publication_year', 'integer')
    .addColumn('total_copies', 'integer', (col) =>
      col.notNull().defaultTo(1)
    )
    .addColumn('available_copies', 'integer', (col) =>
      col.notNull().defaultTo(1)
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();

  // 5. Loans table
  await db.schema
    .createTable('loans')
    .addColumn('id', 'serial', (col) => col.primaryKey())
    .addColumn('book_id', 'integer', (col) =>
      col.references('books.id').onDelete('cascade').notNull()
    )
    .addColumn('borrower_id', 'integer', (col) =>
      col.references('borrowers.id').onDelete('cascade').notNull()
    )
    .addColumn('loan_date', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .addColumn('due_date', 'timestamp', (col) => col.notNull())
    .addColumn('return_date', 'timestamp')
    .addColumn('status', 'varchar(255)', (col) =>
      col.notNull().defaultTo('active')
    )
    .addColumn('created_at', 'timestamp', (col) =>
      col.defaultTo(sql`NOW()`).notNull()
    )
    .execute();
}

export async function down(db: Kysely<any>): Promise<void> {
  // Drop tables in reverse dependency order
  await db.schema.dropTable('loans').execute();
  await db.schema.dropTable('books').execute();
  await db.schema.dropTable('borrowers').execute();
  await db.schema.dropTable('genres').execute();
  await db.schema.dropTable('authors').execute();
}
