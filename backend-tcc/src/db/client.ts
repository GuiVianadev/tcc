import { drizzle } from "drizzle-orm/node-postgres";
import {
  flashcards,
  materials,
  quizzes,
  study_goals,
  study_sessions,
  summaries,
  users,
} from "../db/schema.ts";
import { env } from "../env/index.ts";
export const db = drizzle(env.DATABASE_URL, {
  schema: {
    users,
    summaries,
    flashcards,
    materials,
    quizzes,
    study_goals,
    study_sessions,
  },
  logger: env.NODE_ENV === "dev",
});
