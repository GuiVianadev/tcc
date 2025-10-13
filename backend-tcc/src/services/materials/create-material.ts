// services/create-material-service.ts

import { db } from "@/db/client.ts";
import { flashcards, quizzes, summaries } from "@/db/schema.ts";
import type { MaterialsRepository } from "@/repositories/materials-repository.ts";
import type { UserRepository } from "@/repositories/users-repository.ts";
import { generateContent } from "../../utils/ai.ts";
import { NotFoundError } from "../errors/not-found.error.ts";

type CreateMaterialRequest = {
  userId: string;
  title: string;
  topic?: string;
  content?: string; // Para texto
  fileBuffer?: Buffer; // Para arquivo
  mimeType?: string; // Para arquivo
  flashcardsQuantity?: number;
  quizzesQuantity?: number;
};

export class CreateMaterialService {
  private readonly materialRepository: MaterialsRepository;
  private readonly userRepository: UserRepository;
  constructor(
    materialRepository: MaterialsRepository,
    userRepository: UserRepository
  ) {
    this.materialRepository = materialRepository;
    this.userRepository = userRepository;
  }

  async execute(request: CreateMaterialRequest) {
    // 1. Valida usuário
    const user = await this.userRepository.findById(request.userId);
    if (!user) {
      throw new NotFoundError();
    }

    // 2. Valida que tem conteúdo
    if (!(request.topic || request.content || request.fileBuffer)) {
      throw new Error("Forneça conteúdo (tópico, texto ou arquivo)");
    }

    // 3. Determina tipo de conteúdo para salvar no material
    const contentPreview =
      request.topic || request.content || `Arquivo: ${request.mimeType}`;

    // 4. Cria material
    const material = await this.materialRepository.create({
      title: request.title,
      content: contentPreview,
      user_id: request.userId,
    });

    // 5. Gera conteúdo com IA
    let aiResponse;
    try {
      if (request.topic) {
        // ✅ Tópico/prompt curto
        aiResponse = await generateContent(request.topic, {
          flashcardsQuantity: request.flashcardsQuantity,
          quizzesQuantity: request.quizzesQuantity,
        });
      } else if (request.content) {
        // ✅ Texto simples
        aiResponse = await generateContent(request.content, {
          flashcardsQuantity: request.flashcardsQuantity,
          quizzesQuantity: request.quizzesQuantity,
        });
      } else if (request.fileBuffer && request.mimeType) {
        // ✅ Arquivo (Gemini processa)
        aiResponse = await generateContent(
          {
            buffer: request.fileBuffer,
            mimeType: request.mimeType,
          },
          {
            flashcardsQuantity: request.flashcardsQuantity,
            quizzesQuantity: request.quizzesQuantity,
          }
        );
      }
    } catch (error) {
      // Se IA falhar, deleta material
      await this.materialRepository.deleteMaterial(material.id);
      throw new Error(
        error instanceof Error
          ? error.message
          : "Falha ao gerar conteúdo com IA"
      );
    }

    // 6. Salva tudo em transação
    let savedSummary, savedFlashcards, savedQuizzes;

    try {
      await db.transaction(async (tx) => {
        // Summary
        [savedSummary] = await tx
          .insert(summaries)
          .values({
            content: aiResponse.summary,
            material_id: material.id,
            user_id: request.userId,
          })
          .returning();

        // Flashcards
        savedFlashcards = await tx
          .insert(flashcards)
          .values(
            aiResponse.flashcards.map((card) => ({
              question: card.question,
              answer: card.answer,
              material_id: material.id,
              user_id: request.userId,
            }))
          )
          .returning();

        // Quizzes
        savedQuizzes = await tx
          .insert(quizzes)
          .values(
            aiResponse.quizzes.map((quiz) => ({
              question: quiz.question,
              options: quiz.options,
              correct_answer: quiz.correct_answer,
              material_id: material.id,
              user_id: request.userId,
            }))
          )
          .returning();
      });
    } catch (error) {
      // Se salvar falhar, deleta material
      await this.materialRepository.deleteMaterial(material.id);
      throw new Error("Falha ao salvar conteúdo gerado");
    }

    return {
      material: {
        id: material.id,
        title: material.title,
        created_at: material.created_at,
      },
      summary: savedSummary,
      flashcards: savedFlashcards,
      quizzes: savedQuizzes,
    };
  }
}
