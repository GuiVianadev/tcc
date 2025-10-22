import { type Flashcard } from "@/api/flashcards";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface FlashcardReviewCardProps {
  flashcard: Flashcard;
  isFlipped: boolean;
  onClick: () => void;
}

/**
 * Componente de Flashcard com animação flip 3D
 *
 * Features:
 * - Animação flip CSS 3D transform
 * - Frente mostra pergunta
 * - Verso mostra resposta
 * - Badge com informações do material
 *
 * @example
 * ```tsx
 * <FlashcardReviewCard
 *   flashcard={currentFlashcard}
 *   isFlipped={isFlipped}
 *   onClick={flipCard}
 * />
 * ```
 */
export function FlashcardReviewCard({
  flashcard,
  isFlipped,
  onClick,
}: FlashcardReviewCardProps) {
  return (
    <div className="perspective-1000 w-full max-w-2xl mx-auto px-4">
      <div
        className={`relative w-full h-96 cursor-pointer transition-transform duration-500 transform-style-3d ${isFlipped ? "rotate-y-180" : ""
          }`}
        onClick={onClick}
        style={{
          transformStyle: "preserve-3d",
          transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Frente do Card - Pergunta */}
        <Card
          className={`absolute inset-0 backface-hidden ${isFlipped ? "invisible" : "visible"
            }`}
          style={{ backfaceVisibility: "hidden" }}
        >
          <CardContent className="flex flex-col h-full p-4 sm:p-6 overflow-y-auto">
            <Badge variant="outline" className="mb-4 flex-shrink-0 self-center">
              {flashcard.material_title || "Material"}
            </Badge>
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto">
              <div className="text-center space-y-2 w-full px-2">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Pergunta
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold break-words hyphens-auto word-break">
                  {flashcard.question}
                </h2>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mt-4 flex-shrink-0 text-center">
              Clique para ver a resposta
            </p>
          </CardContent>
        </Card>

        {/* Verso do Card - Resposta */}
        <Card
          className={`absolute inset-0 backface-hidden bg-primary/5 ${isFlipped ? "visible" : "invisible"
            }`}
          style={{
            backfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
          }}
        >
          <CardContent className="flex flex-col h-full p-4 sm:p-6 overflow-y-auto">
            <Badge variant="outline" className="mb-4 flex-shrink-0 self-center">
              {flashcard.material_title || "Material"}
            </Badge>
            <div className="flex-1 flex flex-col items-center justify-center min-h-0 overflow-y-auto">
              <div className="text-center space-y-2 w-full px-2">
                <p className="text-sm text-muted-foreground uppercase tracking-wide">
                  Resposta
                </p>
                <h2 className="text-xl sm:text-2xl font-semibold break-words hyphens-auto whitespace-pre-wrap word-break">
                  {flashcard.answer}
                </h2>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t w-full text-center flex-shrink-0">
              <p className="text-sm text-muted-foreground break-words word-break px-2">
                Pergunta: {flashcard.question}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <style>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        .transform-style-3d {
          transform-style: preserve-3d;
        }
        .backface-hidden {
          backface-visibility: hidden;
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
        .word-break {
          word-break: break-word;
          overflow-wrap: break-word;
        }
      `}</style>
    </div>
  );
}
