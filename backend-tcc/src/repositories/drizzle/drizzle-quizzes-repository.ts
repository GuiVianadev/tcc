import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { materials, quizzes } from "../../db/schema.ts";
import type { Quiz, QuizListItem, QuizzesRepository } from "../quizzes-repository.ts";

export class DrizzleQuizzesRepository implements QuizzesRepository {
  async findByMaterialId(materialId: string): Promise<Quiz[]> {
    const quizzesList = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.material_id, materialId))
      .orderBy(desc(quizzes.created_at))
      .execute();

    return quizzesList;
  }

  async findById(id: string): Promise<Quiz | null> {
    const [quiz] = await db
      .select()
      .from(quizzes)
      .where(eq(quizzes.id, id))
      .execute();

    return quiz || null;
  }

  async findManyByUserId(userId: string, page: number, pageSize: number): Promise<QuizListItem[]> {
    const quizzesList = await db
      .select({
        id: quizzes.id,
        question: quizzes.question,
        material_id: quizzes.material_id,
        material_title: materials.title,
        created_at: quizzes.created_at,
      })
      .from(quizzes)
      .innerJoin(materials, eq(quizzes.material_id, materials.id))
      .where(eq(quizzes.user_id, userId))
      .orderBy(desc(quizzes.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    return quizzesList;
  }
}
