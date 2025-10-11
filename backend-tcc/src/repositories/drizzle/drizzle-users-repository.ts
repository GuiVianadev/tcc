import { eq, type InferInsertModel } from "drizzle-orm";
import { db } from "../../db/client.ts";
import { users } from "../../db/schema.ts";
import type { UserRepository } from "../users-repository.ts";

export class DrizzleUsersRepository implements UserRepository {
  async create(data: InferInsertModel<typeof users>) {
    const [user] = await db.insert(users).values(data).returning();
    return user;
  }
  async findByEmail(email: string) {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user ?? null;
  }

  async findById(id: string) {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user ?? null;
  }

  async updateUser(
    id: string,
    data: Partial<InferInsertModel<typeof users>>
  ): Promise<InferInsertModel<typeof users>> {
    const [userUpdated] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, id))
      .returning();

    return userUpdated;
  }

  async deleteUser(id: string): Promise<boolean> {
    const deleteRows = await db
      .delete(users)
      .where(eq(users.id, id))
      .returning({ id: users.id });
    return deleteRows.length > 0;
  }
}
