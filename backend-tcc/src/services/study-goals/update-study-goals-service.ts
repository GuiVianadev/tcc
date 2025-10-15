import { eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { study_goals } from "../../db/schema.ts";
import { NotFoundError } from "../errors/not-found.error.ts";

type UpdateStudyGoalsRequest = {
  userId: string;
  area_of_interest?: string;
  daily_flashcards_goal?: number;
  daily_quizzes_goal?: number;
};

type UpdateStudyGoalsResponse = {
  id: string;
  user_id: string;
  area_of_interest: string;
  daily_flashcards_goal: number;
  daily_quizzes_goal: number;
  created_at: Date;
  updatedAt: Date;
};

export class UpdateStudyGoalsService {
  async execute({
    userId,
    area_of_interest,
    daily_flashcards_goal,
    daily_quizzes_goal,
  }: UpdateStudyGoalsRequest): Promise<UpdateStudyGoalsResponse> {
    // Verificar se existe meta para o usuário
    const existing = await db
      .select()
      .from(study_goals)
      .where(eq(study_goals.user_id, userId))
      .execute();

    if (existing.length === 0) {
      throw new NotFoundError("Study goals not found for this user");
    }

    // Preparar dados para atualização (apenas campos fornecidos)
    const updateData: {
      area_of_interest?: string;
      daily_flashcards_goal?: number;
      daily_quizzes_goal?: number;
      updatedAt: Date;
    } = {
      updatedAt: new Date(),
    };

    if (area_of_interest !== undefined) {
      updateData.area_of_interest = area_of_interest;
    }

    if (daily_flashcards_goal !== undefined) {
      updateData.daily_flashcards_goal = daily_flashcards_goal;
    }

    if (daily_quizzes_goal !== undefined) {
      updateData.daily_quizzes_goal = daily_quizzes_goal;
    }

    // Atualizar meta existente
    const [updated] = await db
      .update(study_goals)
      .set(updateData)
      .where(eq(study_goals.user_id, userId))
      .returning()
      .execute();

    return updated;
  }
}