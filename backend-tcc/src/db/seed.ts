import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { hash } from "bcryptjs";
import { users } from "./schema.ts";
import dotenv from "dotenv";

dotenv.config();

const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Admin";

async function seed() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error(
      "ADMIN_EMAIL e ADMIN_PASSWORD devem estar definidos no arquivo .env"
    );
    process.exit(1);
  }

  if (!process.env.DATABASE_URL) {
    console.error("DATABASE_URL deve estar definida no arquivo .env");
    process.exit(1);
  }


  const db = drizzle(process.env.DATABASE_URL);

  try {
    // Verifica se já existe um usuário admin com esse email
    const existingAdmin = await db
      .select()
      .from(users)
      .where(eq(users.email, ADMIN_EMAIL))
      .limit(1);

    if (existingAdmin.length > 0) {
      if (existingAdmin[0].role === "admin") {
      } else {
        await db
          .update(users)
          .set({ role: "admin" })
          .where(eq(users.email, ADMIN_EMAIL));
      }
    } else {
      const passwordHash = await hash(ADMIN_PASSWORD, 10);

      await db.insert(users).values({
        name: ADMIN_NAME,
        email: ADMIN_EMAIL,
        password_hashed: passwordHash,
        role: "admin",
        is_first_access: false,
      });
    }
    process.exit(0);
  } catch (error) {
    console.error(" Erro ao executar seed:", error);
    process.exit(1);
  }
}

seed();