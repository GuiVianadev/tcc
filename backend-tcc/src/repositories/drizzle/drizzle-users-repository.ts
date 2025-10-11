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
}
