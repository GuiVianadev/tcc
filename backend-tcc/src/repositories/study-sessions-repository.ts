import type { InferSelectModel } from "drizzle-orm";
import type { study_sessions } from "../db/schema.ts";

export type StudySession = InferSelectModel<typeof study_sessions>;

export type UpsertStudySessionData = {
  user_id: string;
  date: Date;
  flashcards_studied?: number;
  flashcards_correct?: number;
  quizzes_completed?: number;
  quizzes_correct?: number;
};

export type StudySessionsRepository = {
  upsertSession(data: UpsertStudySessionData): Promise<StudySession>;
  findByUserAndDate(userId: string, date: Date): Promise<StudySession | null>;
};
