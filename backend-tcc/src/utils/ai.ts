import { google } from "@ai-sdk/google";
import { groq } from "@ai-sdk/groq";
import { generateObject } from "ai";
import { z } from "zod";

const MAX_QUESTION = 500;
const MAX_ANSWER = 1000;
const MIN_SUMMARY = 1000;
const MAX_SUMMARY = 8000;

const flashcardSchema = z.object({
  question: z.string().min(10).max(MAX_QUESTION),
  answer: z.string().min(5).max(MAX_ANSWER),
});

const quizSchema = z.object({
  question: z.string().min(10).max(MAX_QUESTION),
  options: z
    .array(
      z.object({
        id: z.enum(["a", "b", "c", "d"]),
        text: z.string().min(1).max(MAX_QUESTION),
      })
    )
    .length(4),
  correct_answer: z.enum(["a", "b", "c", "d"]),
});

const aiResponseSchema = z.object({
  summary: z.string().min(MIN_SUMMARY).max(MAX_SUMMARY),
  flashcards: z.array(flashcardSchema).min(5).max(20),
  quizzes: z.array(quizSchema).min(10).max(15),
});

export type AIResponse = z.infer<typeof aiResponseSchema>;

const DEFAULT_FLASHCARDS = 15;
const DEFAULT_QUIZZES = 15;

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

  const prompt = buildPrompt(flashcardsQuantity, quizzesQuantity);

  const textModels = [
    { provider: groq, model: "moonshotai/kimi-k2-instruct" },
    { provider: google, model: "gemini-2.0-flash" },
  ];

  for (const { provider, model} of textModels) {
    try {
      const result = await generateObject({
        model: provider(model),
        messages: [
          {
            role: "user",
            content: `${prompt}\n\n=== TÓPICO/CONTEÚDO ===\n${text}`,
          },
        ],
        schema: aiResponseSchema,
        temperature: 0.5,
      });

      return result.object;
    } catch (error) {
      if (model !== textModels[textModels.length - 1].model) {
        continue;
      }
      
      throw new Error("Falha ao processar texto com todos os modelos disponíveis");
    }
  }

  throw new Error("Nenhum modelo disponível para processar texto");
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
    throw new Error(`Formato não suportado: ${mimeType}`);
  }

  const prompt = buildPrompt(flashcardsQuantity, quizzesQuantity);
  const base64Data = buffer.toString("base64");
  const dataUrl = `data:${mimeType};base64,${base64Data}`;

  const fileModels = [
    { model: "gemini-2.0-flash"},
    { model: "gemini-2.0-flash-001"  },
  ];

  for (const { model } of fileModels) {
    try {
      const result = await generateObject({
        model: google(model),
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
        temperature: 0.5,
      });

      return result.object;
    } catch (error) {
      if (model !== fileModels[fileModels.length - 1].model) {
        continue;
      }
      
      throw new Error("Falha ao processar arquivo com todos os modelos disponíveis");
    }
  }

  throw new Error("Nenhum modelo disponível para processar arquivo");
}

function buildPrompt(flashcardsQty: number, quizzesQty: number): string {
  return `Você é um especialista em educação. Analise o conteúdo e gere:

1. **RESUMO** (600-800 palavras):
   - Use markdown (##, ###, **negrito** para termos-chave, \`\`\` para código)
   - Estrutura: Introdução → Conceitos principais → Exemplos práticos → Conclusão
   - Seja técnico, preciso e organizado

2. **${flashcardsQty} FLASHCARDS**:
   - Perguntas claras e objetivas
   - Respostas completas mas concisas (2-4 linhas)
   - Varie: definições, comparações, casos de uso, exemplos práticos
   - Dificuldade progressiva (básico → intermediário)

3. **${quizzesQty} QUESTÕES DE MÚLTIPLA ESCOLHA**:
   - 4 alternativas (a, b, c, d), apenas 1 correta
   - Distratores plausíveis baseados em erros comuns
   - Dificuldade: ${Math.ceil(quizzesQty * 0.3)} fáceis, ${Math.floor(quizzesQty * 0.5)} médias, ${Math.floor(quizzesQty * 0.2)} difíceis
   - Varie formatos: cenários práticos, análise de código, questões conceituais

**REGRAS:**
- Use português brasileiro formal
- Baseie-se APENAS no conteúdo fornecido
- Para arquivos: extraia TODO o texto (tabelas, diagramas, legendas)
- NÃO use referências como "Figura 2 do material"
- Formatação Markdown consistente`;
}