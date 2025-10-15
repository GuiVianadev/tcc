import { eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { study_goals } from "../../db/schema.ts";
import { NotFoundError } from "../errors/not-found.error.ts";

type GetStudyGoalsRequest = {
  userId: string;
};

type GetStudyGoalsResponse = {
  id: string;
  user_id: string;
  area_of_interest: string;
  daily_flashcards_goal: number;
  daily_quizzes_goal: number;
  created_at: Date;
  updatedAt: Date;
};

export class GetStudyGoalsService {
  async execute({
    userId,
  }: GetStudyGoalsRequest): Promise<GetStudyGoalsResponse> {
    const [goals] = await db
      .select()
      .from(study_goals)
      .where(eq(study_goals.user_id, userId))
      .execute();

    if (!goals) {
      throw new NotFoundError();
    }

    return goals;
  }
}
