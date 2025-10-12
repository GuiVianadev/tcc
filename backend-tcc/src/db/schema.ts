import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  unique,
  uuid,
} from "drizzle-orm/pg-core";

const FLASHCARD_GOAL = 20;
const DEFAULT_EASE_FACTOR = 2.5;

export const roles = pgEnum("role", ["student", "admin"]);

export const users = pgTable("users", {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().notNull().unique(),
  role: roles().default("student").notNull(),
  password_hashed: text().notNull(),
  is_first_access: boolean().default(true).notNull(),

  updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  deleted_at: timestamp("deleted_at", { withTimezone: true, mode: "date" }),
});

export const materials = pgTable(
  "materials",
  {
    id: uuid().primaryKey().defaultRandom(),
    title: text().notNull(),
    content: text().notNull(),
    user_id: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    created_at: timestamp("created_at").notNull().defaultNow(),
    updated_at: timestamp("updated_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [index("materials_user_idx").on(table.user_id)]
);

export const summaries = pgTable(
  "summaries",
  {
    id: uuid().primaryKey().defaultRandom(),
    content: text().notNull(),
    user_id: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    material_id: uuid()
      .references(() => materials.id, { onDelete: "cascade" })
      .notNull()
      .unique(),

    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [index("summaries_material_idx").on(table.material_id)]
);

export const flashcards = pgTable(
  "flashcards",
  {
    id: uuid().primaryKey().defaultRandom(),
    question: text().notNull(),
    answer: text().notNull(),
    user_id: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    material_id: uuid()
      .references(() => materials.id, { onDelete: "cascade" })
      .notNull(),

    // Repetição Espaçada (SM-2 simplificado)
    ease_factor: real().default(DEFAULT_EASE_FACTOR).notNull(),
    interval_days: integer().default(0).notNull(),
    repetitions: integer().default(0).notNull(),
    next_review: timestamp("next_review"),

    created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("flashcards_material_idx").on(table.material_id),
    index("flashcards_next_review_idx").on(table.next_review),
  ]
);

export const quizzes = pgTable(
  "quizzes",
  {
    id: uuid().primaryKey().defaultRandom(),
    question: text().notNull(),
    options: jsonb().notNull(), // [{ id: "a", text: "..." }, ...]
    correct_answer: text().notNull(), // "a", "b", "c", "d"
    studied: boolean().default(false).notNull(), // Marca se já foi respondido
    user_id: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    material_id: uuid()
      .references(() => materials.id, { onDelete: "cascade" })
      .notNull(),

    created_at: timestamp("created_at").notNull().defaultNow(),
  },
  (table) => [
    index("quizzes_material_idx").on(table.material_id),
    index("quizzes_studied_idx").on(table.studied),
  ]
);

export const study_sessions = pgTable(
  "study_sessions",
  {
    id: uuid().primaryKey().defaultRandom(),
    user_id: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),

    date: timestamp("date").notNull().defaultNow(),

    flashcards_studied: integer().default(0).notNull(),
    flashcards_correct: integer().default(0).notNull(),

    quizzes_completed: integer().default(0).notNull(),
    quizzes_correct: integer().default(0).notNull(),
  },
  (table) => [
    index("sessions_user_date_idx").on(table.user_id, table.date),
    unique("sessions_user_date_unique").on(table.user_id, table.date),
  ]
);

export const study_goals = pgTable("study_goals", {
  id: uuid().primaryKey().defaultRandom(),
  user_id: uuid()
    .references(() => users.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  area_of_interest: text().notNull(),
  daily_flashcards_goal: integer().default(FLASHCARD_GOAL).notNull(),
  daily_quizzes_goal: integer().default(10).notNull(),

  created_at: timestamp("created_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "date" })
    .notNull()
    .defaultNow(),
});

// Analytics - Quiz Attempts
export const quiz_attempts = pgTable(
  "quiz_attempts",
  {
    id: uuid().primaryKey().defaultRandom(),
    quiz_id: uuid()
      .references(() => quizzes.id, { onDelete: "cascade" })
      .notNull(),
    user_id: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    selected_answer: text().notNull(),
    is_correct: boolean().notNull(),
    attempted_at: timestamp("attempted_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("quiz_attempts_quiz_idx").on(table.quiz_id),
    index("quiz_attempts_user_idx").on(table.user_id),
  ]
);

// Analytics - Flashcard Reviews
export const flashcard_reviews = pgTable(
  "flashcard_reviews",
  {
    id: uuid().primaryKey().defaultRandom(),
    flashcard_id: uuid()
      .references(() => flashcards.id, { onDelete: "cascade" })
      .notNull(),
    user_id: uuid()
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    difficulty: text().notNull(), // "again", "hard", "good", "easy"
    ease_factor_after: real().notNull(),
    interval_days_after: integer().notNull(),
    reviewed_at: timestamp("reviewed_at", { withTimezone: true, mode: "date" })
      .notNull()
      .defaultNow(),
  },
  (table) => [
    index("flashcard_reviews_flashcard_idx").on(table.flashcard_id),
    index("flashcard_reviews_user_idx").on(table.user_id),
  ]
);
