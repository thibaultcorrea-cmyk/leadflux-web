import { defineConfig } from "drizzle-kit";
import { ENV } from "./core/env";


export default defineConfig({
  schema: "./db/schemas",
  out: "./db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: ENV.DATABASE_URL,
  },
});
