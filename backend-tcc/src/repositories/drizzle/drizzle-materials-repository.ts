import {
  asc,
  count,
  desc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { db } from "../../db/client.ts";
import { flashcards, materials, quizzes, summaries } from "../../db/schema.ts";
import type {
  CreateMaterialWithContent,
  MaterialsRepository,
} from "../materials-repository.ts";

const RECENT_MATERIALS = 2;

export class DrizzleMaterialsRepository implements MaterialsRepository {
  async create(
    data: InferInsertModel<typeof materials>
  ): Promise<InferSelectModel<typeof materials>> {
    const [createdMaterial] = await db
      .insert(materials)
      .values(data)
      .returning();
    return createdMaterial;
  }

  async createWithContent(data: CreateMaterialWithContent) {
    return await db.transaction(async (tx) => {
      // 1. Criar material
      const [createdMaterial] = await tx
        .insert(materials)
        .values(data.material)
        .returning();

      // 2. Criar summary
      const [createdSummary] = await tx
        .insert(summaries)
        .values({
          content: data.summary.content,
          user_id: data.summary.user_id,
          material_id: createdMaterial.id,
        })
        .returning();

      // 3. Criar flashcards
      const createdFlashcards = await tx
        .insert(flashcards)
        .values(
          data.flashcards.map((fc) => ({
            question: fc.question,
            answer: fc.answer,
            user_id: fc.user_id,
            material_id: createdMaterial.id,
          }))
        )
        .returning();

      // 4. Criar quizzes
      const createdQuizzes = await tx
        .insert(quizzes)
        .values(
          data.quizzes.map((quiz) => ({
            question: quiz.question,
            options: quiz.options,
            correct_answer: quiz.correct_answer,
            user_id: quiz.user_id,
            material_id: createdMaterial.id,
          }))
        )
        .returning();

      return {
        material: createdMaterial,
        summary: createdSummary,
        flashcards: createdFlashcards,
        quizzes: createdQuizzes,
      };
    });
  }

  async findById(
    id: string
  ): Promise<InferSelectModel<typeof materials> | null> {
    const [material] = await db
      .select()
      .from(materials)
      .where(eq(materials.id, id))
      .execute();
    return material;
  }
  async searchManyByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<InferSelectModel<typeof materials>[]> {
    const userMaterials = await db
      .select()
      .from(materials)
      .where(eq(materials.user_id, userId))
      .orderBy(asc(materials.id))
      .limit(pageSize)
      .offset((page - 1) * pageSize);

    return userMaterials;
  }
  async searchRecentsByUserId(
    userId: string
  ): Promise<InferSelectModel<typeof materials>[]> {
    const userMaterials = await db
      .select()
      .from(materials)
      .where(eq(materials.user_id, userId))
      .orderBy(desc(materials.created_at))
      .limit(RECENT_MATERIALS);

    return userMaterials;
  }

  async countByUserId(userId: string): Promise<number> {
    const [result] = await db
      .select({ count: count() })
      .from(materials)
      .where(eq(materials.user_id, userId));

    return result.count;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const deleteRows = await db
      .delete(materials)
      .where(eq(materials.id, id))
      .returning({ id: materials.id });
    return deleteRows.length > 0;
  }
}
