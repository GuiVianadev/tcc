import type { FastifyReply, FastifyRequest } from "fastify";
import z from "zod";
import { makeCreateMaterial } from "../../../services/factories/materials/make-create-material.ts";

const CREATED = 201;
const BAD_REQUEST = 400;

// Schema para quando o conteúdo vem como JSON (tópico/prompt)
const textSchema = z.object({
  title: z.string().min(3).max(200),
  topic: z.string().min(3).max(500), // Tópico/prompt curto
  flashcardsQuantity: z.number().int().min(5).max(20).optional(),
  quizzesQuantity: z.number().int().min(3).max(15).optional(),
});

// Schema para quando o conteúdo vem como arquivo (multipart)
const fileSchema = z.object({
  title: z.string().min(3).max(200),
  flashcardsQuantity: z.coerce.number().int().min(5).max(20).optional(),
  quizzesQuantity: z.coerce.number().int().min(3).max(15).optional(),
});

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
  "image/png",
  "image/jpeg",
];

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

export async function createMaterial(
  request: FastifyRequest,
  reply: FastifyReply
) {
  const contentType = request.headers["content-type"];

  try {
    const createMaterialService = makeCreateMaterial();

    // Caso 1: JSON (tópico)
    if (contentType?.includes("application/json")) {
      const { title, topic, flashcardsQuantity, quizzesQuantity } =
        textSchema.parse(request.body);

      const result = await createMaterialService.execute({
        userId: request.user.sub,
        title,
        topic,
        flashcardsQuantity,
        quizzesQuantity,
      });

      return reply.status(CREATED).send(result);
    }

    // Caso 2: Multipart (arquivo)
    if (contentType?.includes("multipart/form-data")) {
      const data = await (request as any).file();

      if (!data) {
        return reply.status(BAD_REQUEST).send({ message: "File is required" });
      }

      // Validar mimetype
      if (!ALLOWED_MIME_TYPES.includes(data.mimetype)) {
        return reply.status(BAD_REQUEST).send({
          message: `File type not supported. Allowed types: ${ALLOWED_MIME_TYPES.join(", ")}`,
        });
      }

      // Converter para buffer
      const buffer = await data.toBuffer();

      // Validar tamanho
      if (buffer.length > MAX_FILE_SIZE) {
        return reply.status(BAD_REQUEST).send({
          message: `File size exceeds maximum of ${MAX_FILE_SIZE / 1024 / 1024}MB`,
        });
      }

      // Extrair valores dos fields (fastify-multipart retorna objetos com .value)
      const rawFields = data.fields as Record<string, { value: string }>;
      const extractedFields = {
        title: rawFields.title?.value,
        flashcardsQuantity: rawFields.flashcardsQuantity?.value,
        quizzesQuantity: rawFields.quizzesQuantity?.value,
      };

      // Validar fields
      const fields = fileSchema.parse(extractedFields);

      const result = await createMaterialService.execute({
        userId: request.user.sub,
        title: fields.title,
        fileBuffer: buffer,
        mimeType: data.mimetype,
        flashcardsQuantity: fields.flashcardsQuantity,
        quizzesQuantity: fields.quizzesQuantity,
      });

      return reply.status(CREATED).send(result);
    }

    // Caso 3: Content-Type inválido
    return reply.status(BAD_REQUEST).send({
      message: "Content-Type must be application/json or multipart/form-data",
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      return reply.status(BAD_REQUEST).send({
        message: "Validation error",
        errors: err.issues,
      });
    }
    throw err;
  }
}
