import { and, count, desc, eq } from "drizzle-orm";
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

  async findUnstudiedByMaterialId(materialId: string, limit: number): Promise<Quiz[]> {
    const unstudiedQuizzes = await db
      .select()
      .from(quizzes)
      .where(
        and(
          eq(quizzes.material_id, materialId),
          eq(quizzes.studied, false)
        )
      )
      .limit(limit)
      .execute();

    return unstudiedQuizzes;
  }

  async markAsStudied(quizId: string): Promise<Quiz> {
    const [updatedQuiz] = await db
      .update(quizzes)
      .set({ studied: true })
      .where(eq(quizzes.id, quizId))
      .returning()
      .execute();

    return updatedQuiz;
  }

  async countByMaterialId(materialId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(quizzes)
      .where(eq(quizzes.material_id, materialId))
      .execute();

    return result?.count || 0;
  }

  async countStudiedByMaterialId(materialId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(quizzes)
      .where(
        and(
          eq(quizzes.material_id, materialId),
          eq(quizzes.studied, true)
        )
      )
      .execute();

    return result?.count || 0;
  }

  async resetProgress(materialId: string): Promise<void> {
    await db
      .update(quizzes)
      .set({ studied: false })
      .where(eq(quizzes.material_id, materialId))
      .execute();
  }
}
