import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { users } from "../db/schema.ts";

export type User = InferSelectModel<typeof users>;

export type UserRepository = {
  create(
    data: InferInsertModel<typeof users>
  ): Promise<InferInsertModel<typeof users>>;
  updateUser(
    id: string,
    data: Partial<InferInsertModel<typeof users>>
  ): Promise<InferInsertModel<typeof users>>;
  findByEmail(email: string): Promise<InferInsertModel<typeof users> | null>;
  findById(id: string): Promise<InferSelectModel<typeof users> | null>;
  deleteUser(id: string): Promise<boolean>;
};
