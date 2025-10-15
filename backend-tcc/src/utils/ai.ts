import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";

const MAX_QUESTION = 500;
const MAX_ANSWER = 1000;
const MIN_SUMMARY = 100;
const MAX_SUMMARY = 1000;

const flashcardSchema = z.object({
  question: z.string().min(10).max(MAX_QUESTION),
  answer: z.string().min(10).max(MAX_ANSWER),
});

const quizSchema = z.object({
  question: z.string().min(10).max(MAX_QUESTION),
  options: z
    .array(
      z.object({
        id: z.enum(["a", "b", "c", "d"]),
        text: z.string().min(1).max(MAX_QUESTION), // Reduzido de 5 para 1 (aceita "Sim", "Não", etc)
      })
    )
    .length(4),
  correct_answer: z.enum(["a", "b", "c", "d"]),
});

const aiResponseSchema = z.object({
  summary: z
    .string()
    .min(MIN_SUMMARY)
    .max(MAX_SUMMARY * 4), // Aumentado para 2000 caracteres
  flashcards: z.array(flashcardSchema).min(5).max(20),
  quizzes: z.array(quizSchema).min(10).max(15), // Limite do Gemini para evitar timeout
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

const DEFAULT_FLASHCARDS = 10;
const DEFAULT_QUIZZES = 15; // Fixo em 30 para evitar timeout do Gemini (3 sessões x 10 questões)

type GenerateOptions = {
  flashcardsQuantity?: number;
  quizzesQuantity?: number;
};

export async function generateContent(
  input: string | { buffer: Buffer; mimeType: string },
  options: GenerateOptions = {}
): Promise<AIResponse> {
  if (typeof input === "string") {
    return await generateFromText(input, options);
  }
  return await generateFromFile(input.buffer, input.mimeType, options);
}

async function generateFromText(
  text: string,
  options: GenerateOptions = {}
): Promise<AIResponse> {
  const {
    flashcardsQuantity = DEFAULT_FLASHCARDS,
    quizzesQuantity = DEFAULT_QUIZZES,
  } = options;

  // Aceita tópicos curtos - IA irá expandir o conteúdo
  const prompt = buildPrompt(flashcardsQuantity, quizzesQuantity);

  try {
    const result = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n=== TÓPICO/CONTEÚDO ===\n${text}`,
        },
      ],
      schema: aiResponseSchema,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    console.error("Erro ao gerar conteúdo com IA:", error);
    throw new Error("Falha ao processar texto com IA");
  }
}

async function generateFromFile(
  buffer: Buffer,
  mimeType: string,
  options: GenerateOptions = {}
): Promise<AIResponse> {
  const {
    flashcardsQuantity = DEFAULT_FLASHCARDS,
    quizzesQuantity = DEFAULT_QUIZZES,
  } = options;

  const GEMINI_SUPPORTED = [
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/png",
    "image/jpeg",
  ];

  if (!GEMINI_SUPPORTED.includes(mimeType)) {
    throw new Error(`Formato não suportado pelo Gemini: ${mimeType}`);
  }

  const prompt = buildPrompt(flashcardsQuantity, quizzesQuantity);

  try {
    const base64Data = buffer.toString("base64");
    const dataUrl = `data:${mimeType};base64,${base64Data}`;

    const result = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              image: dataUrl,
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      schema: aiResponseSchema,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
    throw new Error("Falha ao processar arquivo com IA");
  }
}

function buildPrompt(flashcardsQty: number, quizzesQty: number): string {
  return `Você é um especialista em educação e criação de materiais de estudo de alta qualidade.

Analise o conteúdo fornecido e gere:

1. **RESUMO** (200-400 palavras):
   - Capture os conceitos principais
   - Seja conciso mas completo
   - Use linguagem clara e objetiva
   - Organize em parágrafos lógicos
   - Gere em formato markdown

2. **${flashcardsQty} FLASHCARDS**:
   - Foque nos conceitos mais importantes
   - Perguntas claras e objetivas
   - Respostas completas mas concisas
   - Varie entre definições, exemplos e aplicações
   - Evite perguntas muito óbvias ou muito complexas

3. **${quizzesQty} QUESTÕES DE MÚLTIPLA ESCOLHA**:
   - Teste compreensão profunda do conteúdo
   - 4 alternativas (a, b, c, d)
   - Apenas 1 alternativa correta
   - Distratores plausíveis (não óbvios)
   - Varie a dificuldade (fácil, médio, difícil)

**IMPORTANTE:**
- Use português brasileiro correto
- Seja preciso e educacional
- Baseie-se APENAS no conteúdo fornecido
- Para arquivos: extraia TODO o texto, incluindo tabelas e imagens (quando aplicável)`;
}
