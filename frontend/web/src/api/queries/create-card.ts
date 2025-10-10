import { api } from "@/lib/axios";

export type CardCreateBody = {
  deck_id: number;
  front: string;
  back: string;
  card_type?: "basic" | "cloze" | "multiple_choice";
  tags?: string[];
  difficulty?: "easy" | "medium" | "hard";
};

export async function createCard({
  deck_id,
  front,
  back,
  card_type,
  tags,
  difficulty,
}: CardCreateBody) {
  await api.post("/api/v1/cards", {
    deck_id,
    front,
    back,
    card_type,
    tags,
    difficulty,
  });
}
