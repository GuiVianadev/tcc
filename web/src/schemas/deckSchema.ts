import { z } from "zod";

const deckBaseSchema = z.object({
  title: z.string(),
  description: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  tags: z.array(z.string()).default([]),
  is_public: z.boolean().default(false),
  difficulty_level: z
    .enum(["beginner", "intermediate", "advanced"])
    .default("beginner"),
  srs_settings: z.record(z.any()).default({
    new_cards_per_day: 20,
    max_reviews_per_day: 100,
    learning_steps: [1, 10],
    graduation_interval: 1,
    easy_interval: 4,
  }),
});


export const deckCreateSchema = deckBaseSchema.extend({
  title: z
    .string()
    .min(3, "O título deve ter pelo menos 3 caracteres")
    .transform((val) => val.trim()), // Espelha o .strip() do Python

  difficulty_level: z.enum(["beginner", "intermediate", "advanced"], {
    errorMap: () => ({
      message: "Nível deve ser: beginner, intermediate ou advanced",
    }),
  }),
});

export const deckUpdateSchema = z.object({
  title: z.string().min(3).optional(),
  description: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  tags: z.array(z.string()).optional(),
  is_public: z.boolean().optional(),
  difficulty_level: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  srs_settings: z.record(z.any()).optional(),
});


export const deckResponseSchema = deckBaseSchema.extend({
  id: z.number(),
  owner_id: z.number(),
  total_cards: z.number(),
  total_studies: z.number(),
  average_rating: z.number(),
  rating_count: z.number(),
  is_featured: z.boolean(),
  created_at: z.string().datetime(), // ISO string do backend
  updated_at: z.string().datetime().nullable(),
});


export const deckWithStatsSchema = deckResponseSchema.extend({
  cards_due_today: z.number().default(0),
  cards_new: z.number().default(0),
  cards_learning: z.number().default(0),
  cards_review: z.number().default(0),
  last_study_date: z.string().datetime().nullable(),
});


export type DeckCreateData = z.infer<typeof deckCreateSchema>;
export type DeckUpdateData = z.infer<typeof deckUpdateSchema>;
export type DeckResponse = z.infer<typeof deckResponseSchema>;
export type DeckWithStats = z.infer<typeof deckWithStatsSchema>;



export const cardCreateSchema = z.object({
  front: z
    .string()
    .min(1, "O campo frente é obrigatório")
    .max(500, "Máximo de 500 caracteres"),

  back: z
    .string()
    .min(1, "O campo verso é obrigatório")
    .max(1000, "Máximo de 1000 caracteres"),

  card_type: z.enum(["basic", "cloze", "multiple_choice"]).default("basic"),

  tags: z.array(z.string()).default([]),

  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),

  estimated_time: z
    .number()
    .min(10, "Mínimo de 10 segundos")
    .max(300, "Máximo de 300 segundos")
    .default(30),

  deck_id: z.number(), // Relacionamento com o deck
});

export type CardCreateData = z.infer<typeof cardCreateSchema>;
