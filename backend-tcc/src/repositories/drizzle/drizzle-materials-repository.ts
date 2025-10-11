import {
  asc,
  eq,
  type InferInsertModel,
  type InferSelectModel,
} from "drizzle-orm";
import { db } from "../../db/client.ts";
import { materials } from "../../db/schema.ts";
import type { MaterialsRepository } from "../materials-repository.ts";

const LIMIT_ITENS = 20;

export class DrizzleUsersRepository implements MaterialsRepository {
  async create(
    data: InferInsertModel<typeof materials>
  ): Promise<InferInsertModel<typeof materials>> {
    const [createdMaterial] = await db
      .insert(materials)
      .values(data)
      .returning();
    return createdMaterial;
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
    page: number
  ): Promise<InferSelectModel<typeof materials>[]> {
    const userMaterials = await db
      .select()
      .from(materials)
      .where(eq(materials.user_id, userId))
      .orderBy(asc(materials.id))
      .limit(LIMIT_ITENS)
      .offset((page - 1) * LIMIT_ITENS);

    return userMaterials;
  }

  async deleteMaterial(id: string): Promise<boolean> {
    const deleteRows = await db
      .delete(materials)
      .where(eq(materials.id, id))
      .returning({ id: materials.id });
    return deleteRows.length > 0;
  }
}
