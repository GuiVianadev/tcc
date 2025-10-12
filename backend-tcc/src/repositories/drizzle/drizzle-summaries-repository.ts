import { desc, eq } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { materials, summaries } from "../../db/schema.ts";
import type {
  SummariesRepository,
  Summary,
  SummaryListItem,
} from "../summaries-repository.ts";

export class DrizzleSummariesRepository implements SummariesRepository {
  async findByMaterialId(materialId: string): Promise<Summary | null> {
    const [summary] = await db
      .select()
      .from(summaries)
      .where(eq(summaries.material_id, materialId))
      .execute();

    return summary || null;
  }

  async findManyByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<SummaryListItem[]> {
    const summariesList = await db
      .select({
        id: summaries.id,
        material_id: summaries.material_id,
        material_title: materials.title,
        created_at: summaries.created_at,
      })
      .from(summaries)
      .innerJoin(materials, eq(summaries.material_id, materials.id))
      .where(eq(summaries.user_id, userId))
      .orderBy(desc(summaries.created_at))
      .limit(pageSize)
      .offset((page - 1) * pageSize)
      .execute();

    return summariesList;
  }
}
