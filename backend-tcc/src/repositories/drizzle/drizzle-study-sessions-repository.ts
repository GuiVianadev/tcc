import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { study_sessions } from "../../db/schema.ts";
import type {
  StudySession,
  StudySessionsRepository,
  UpsertStudySessionData,
} from "../study-sessions-repository.ts";

export class DrizzleStudySessionsRepository
  implements StudySessionsRepository
{
  async upsertSession(data: UpsertStudySessionData): Promise<StudySession> {
    // Remover hora da data para comparar apenas dia
    const dateOnly = new Date(data.date);
    dateOnly.setHours(0, 0, 0, 0);

    const [session] = await db
      .insert(study_sessions)
      .values({
        user_id: data.user_id,
        date: dateOnly,
        flashcards_studied: data.flashcards_studied || 0,
        flashcards_correct: data.flashcards_correct || 0,
        quizzes_completed: data.quizzes_completed || 0,
        quizzes_correct: data.quizzes_correct || 0,
      })
      .onConflictDoUpdate({
        target: [study_sessions.user_id, study_sessions.date],
        set: {
          flashcards_studied: sql`${study_sessions.flashcards_studied} + ${data.flashcards_studied || 0}`,
          flashcards_correct: sql`${study_sessions.flashcards_correct} + ${data.flashcards_correct || 0}`,
          quizzes_completed: sql`${study_sessions.quizzes_completed} + ${data.quizzes_completed || 0}`,
          quizzes_correct: sql`${study_sessions.quizzes_correct} + ${data.quizzes_correct || 0}`,
        },
      })
      .returning()
      .execute();

    return session;
  }

  async findByUserAndDate(
    userId: string,
    date: Date
  ): Promise<StudySession | null> {
    const dateOnly = new Date(date);
    dateOnly.setHours(0, 0, 0, 0);

    const [session] = await db
      .select()
      .from(study_sessions)
      .where(
        and(
          eq(study_sessions.user_id, userId),
          eq(study_sessions.date, dateOnly)
        )
      )
      .execute();

    return session || null;
  }
}
