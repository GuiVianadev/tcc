import type { InferSelectModel } from "drizzle-orm";
import type { summaries } from "../db/schema.ts";

export type Summary = InferSelectModel<typeof summaries>;

export type SummaryListItem = {
  id: string;
  material_id: string;
  material_title: string;
  created_at: Date;
};

export type SummariesRepository = {
  findByMaterialId(materialId: string): Promise<Summary | null>;
  findManyByUserId(
    userId: string,
    page: number,
    pageSize: number
  ): Promise<SummaryListItem[]>;
};
