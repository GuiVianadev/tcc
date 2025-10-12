import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { materials } from "../db/schema.ts";

export type Materials = InferSelectModel<typeof materials>;

export type MaterialsRepository = {
  create(
    data: InferInsertModel<typeof materials>
  ): Promise<InferInsertModel<typeof materials>>;
  findById(id: string): Promise<InferSelectModel<typeof materials> | null>;
  searchManyByUserId(userId: string, page: number, pageSize: number): Promise<Materials[]>;
  deleteMaterial(id: string): Promise<boolean>;
};
