import { api } from "@/lib/axios";

export type DeckCreateBody = {
  title: string;
  description?: string;
  subject?: string;
  tags?: string[];
  is_public?: boolean;
  difficulty_level?: "beginner" | "intermediate" | "advanced";
  // biome-ignore lint/suspicious/noExplicitAny: <expect any as sencond parameter>
  srs_settings?: Record<string, any>;
};

export async function createDeck({
  title,
  description,
  difficulty_level,
  is_public,
  srs_settings,
  subject,
  tags,
}: DeckCreateBody) {
  await api.post("/api/v1/cards", {
    title,
    description,
    difficulty_level,
    is_public,
    srs_settings,
    subject,
    tags,
  });
}
