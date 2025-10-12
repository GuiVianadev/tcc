

import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";


const flashcardSchema = z.object({
  question: z.string().min(10).max(500),
  answer: z.string().min(1).max(1000), 
});

const quizSchema = z.object({
  question: z.string().min(10).max(500),
  options: z
    .array(
      z.object({
        id: z.enum(["a", "b", "c", "d"]),
        text: z.string().min(1).max(300), 
      })
    )
    .length(4),
  correct_answer: z.enum(["a", "b", "c", "d"]),
});

const aiResponseSchema = z.object({
  summary: z.string().min(100).max(2000), 
  flashcards: z.array(flashcardSchema).min(5).max(20),
  quizzes: z.array(quizSchema).min(3).max(15),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

const DEFAULT_FLASHCARDS = 10;
const DEFAULT_QUIZZES = 5;

type GenerateOptions = {
  flashcardsQuantity?: number;
  quizzesQuantity?: number;
};



export async function generateContent(
  input: string | { buffer: Buffer; mimeType: string },
  options: GenerateOptions = {}
): Promise<AIResponse> {
  if (typeof input === "string") {
    return generateFromText(input, options);
  }
  return generateFromFile(input.buffer, input.mimeType, options);
}


async function generateFromText(
  text: string,
  options: GenerateOptions = {}
): Promise<AIResponse> {
  const {
    flashcardsQuantity = DEFAULT_FLASHCARDS,
    quizzesQuantity = DEFAULT_QUIZZES,
  } = options;

  if (text.length < 3) {
    throw new Error("Tópico muito curto (mínimo 3 caracteres)");
  }

  const prompt = buildPrompt(flashcardsQuantity, quizzesQuantity);

  try {
    const result = await generateObject({
      model: google("gemini-2.0-flash-exp"),
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n=== CONTEÚDO ===\n${text}`,
        },
      ],
      schema: aiResponseSchema,
      temperature: 0.7,
    });

    return result.object;
  } catch (error) {
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

**SE RECEBER UM TÓPICO CURTO:** Primeiro, escreva um texto educacional completo e detalhado sobre o tópico (mínimo 300 palavras), explicando os conceitos principais, exemplos práticos e contexto. Depois, use ESSE TEXTO para gerar o resumo, flashcards e quizzes.

**SE RECEBER UM TEXTO LONGO:** Analise o conteúdo diretamente.

Com base no conteúdo (gerado ou fornecido), crie:

1. **RESUMO** (máximo 300 palavras):
   - Capture os conceitos principais
   - Seja MUITO conciso mas completo
   - Use linguagem clara e objetiva
   - Organize em parágrafos lógicos
   - NÃO exceda 1500 caracteres

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
