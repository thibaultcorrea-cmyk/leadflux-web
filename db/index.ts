import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { ENV } from "@/core/env";
import * as schemas from "@/db/schemas";

export const pool = new Pool({
    connectionString: ENV.DATABASE_URL,
});




export const db = drizzle({ client: pool, schema: schemas })
