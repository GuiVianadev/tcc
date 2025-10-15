import { eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { study_goals } from "../../db/schema.ts";

type UpsertStudyGoalsRequest = {
  userId: string;
  area_of_interest: string;
  daily_flashcards_goal: number;
  daily_quizzes_goal: number;
};

type UpsertStudyGoalsResponse = {
  id: string;
  user_id: string;
  area_of_interest: string;
  daily_flashcards_goal: number;
  daily_quizzes_goal: number;
  created_at: Date;
  updatedAt: Date;
};

export class UpsertStudyGoalsService {
  async execute({
    userId,
    area_of_interest,
    daily_flashcards_goal,
    daily_quizzes_goal,
  }: UpsertStudyGoalsRequest): Promise<UpsertStudyGoalsResponse> {
    // Verificar se já existe meta para o usuário
    const existing = await db
      .select()
      .from(study_goals)
      .where(eq(study_goals.user_id, userId))
      .execute();

    if (existing.length > 0) {
      // Atualizar meta existente
      const [updated] = await db
        .update(study_goals)
        .set({
          area_of_interest,
          daily_flashcards_goal,
          daily_quizzes_goal,
          updatedAt: new Date(),
        })
        .where(eq(study_goals.user_id, userId))
        .returning()
        .execute();

      return updated;
    }

    // Criar nova meta
    const [created] = await db
      .insert(study_goals)
      .values({
        user_id: userId,
        area_of_interest,
        daily_flashcards_goal,
        daily_quizzes_goal,
      })
      .returning()
      .execute();

    return created;
  }
}