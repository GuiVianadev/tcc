import { count, eq, type InferInsertModel, isNull } from "drizzle-orm";
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
  async findUsers(page: number, pageSize: number) {
    const offset = (page - 1) * pageSize;

    const usersList = await db
      .select({
        id: users.id,
        name: users.name,
        email: users.email,
        role: users.role,
        is_first_access: users.is_first_access,
        created_at: users.created_at,
        updated_at: users.updated_at,
        deleted_at: users.deleted_at,
      })
      .from(users)
      .limit(pageSize)
      .offset(offset)
      .orderBy(users.created_at);

    const [{ total }] = await db
      .select({ total: count() })
      .from(users)

    return {
      users: usersList,
      total: total || 0,
      page,
      pageSize,
    };
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ deleted_at: new Date() })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return result.length > 0;
  }

  async reactivateUser(id: string): Promise<boolean> {
    const result = await db
      .update(users)
      .set({ deleted_at: null })
      .where(eq(users.id, id))
      .returning({ id: users.id });

    return result.length > 0;
  }
}
