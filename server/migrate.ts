
import { drizzle } from "drizzle-orm/neon-serverless";
import { migrate } from "drizzle-orm/neon-serverless/migrator";
import { Pool } from "@neondatabase/serverless";
import * as schema from "@shared/schema";

const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
const db = drizzle(pool, { schema });

async function main() {
  console.log("Running migrations...");
  await migrate(db, { migrationsFolder: "migrations" });
  console.log("Migrations completed!");
  await pool.end();
}

main().catch((err) => {
  console.error("Migration failed!");
  console.error(err);
  process.exit(1);
});
