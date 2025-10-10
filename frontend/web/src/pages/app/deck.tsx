import {
  Brain,
  ChevronLeft,
  Clock,
  Eye,
  EyeOff,
  RotateCcw,
  TrendingUp,
} from "lucide-react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Simulação do React Query
const useQuery = (key, fetcher, options = {}) => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const result = await fetcher();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return { data, isLoading, error };
};

// Algoritmo SuperMemo SM-2 (usado pelo Anki)
const calculateSm2 = (quality, repetitions, easeFactor, interval) => {
  const newEaseFactor = Math.max(
    1.3,
    easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
  );

  if (quality < 3) {
    // Card esquecido - resetar
    return {
      repetitions: 0,
      interval: 1,
      easeFactor: newEaseFactor,
      nextReviewDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 dia
    };
  }
  const newRepetitions = repetitions + 1;
  let newInterval;

  if (newRepetitions === 1) {
    newInterval = 1;
  } else if (newRepetitions === 2) {
    newInterval = 6;
  } else {
    newInterval = Math.round(interval * newEaseFactor);
  }

  return {
    repetitions: newRepetitions,
    interval: newInterval,
    easeFactor: newEaseFactor,
    nextReviewDate: new Date(Date.now() + newInterval * 24 * 60 * 60 * 1000),
  };
};

// Mock de dados com informações do algoritmo SM-2
const mockFlashcards = [
  {
    id: 1,
    front: "O que é React?",
    back: "React é uma biblioteca JavaScript para construir interfaces de usuário, especialmente para aplicações web. Foi criada pelo Facebook e usa um paradigma baseado em componentes.",
    tags: ["javascript", "frontend", "react"],
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date(),
    lastReviewed: null,
    isNew: true,
  },
  {
    id: 2,
    front: "Como funciona o Virtual DOM?",
    back: "O Virtual DOM é uma representação em memória do DOM real. React usa diffing para comparar estados e atualizar apenas os elementos que mudaram, melhorando a performance.",
    tags: ["react", "performance", "dom"],
    repetitions: 2,
    interval: 6,
    easeFactor: 2.3,
    nextReviewDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // Atrasado 2 dias
    lastReviewed: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: 3,
    front: "O que é useEffect?",
    back: "useEffect é um Hook que permite executar efeitos colaterais em componentes funcionais. É usado para operações como chamadas de API, subscrições, ou limpeza manual do DOM.",
    tags: ["hooks", "react", "useeffect"],
    repetitions: 1,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    lastReviewed: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
  {
    id: 4,
    front: "Qual a diferença entre useState e useRef?",
    back: "useState retorna um valor de estado e uma função para atualizá-lo, causando re-render. useRef retorna um objeto mutável que persiste durante o ciclo de vida do componente sem causar re-render.",
    tags: ["hooks", "react", "performance"],
    repetitions: 0,
    interval: 1,
    easeFactor: 2.5,
    nextReviewDate: new Date(),
    lastReviewed: null,
    isNew: true,
  },
  {
    id: 5,
    front: "O que é Context API?",
    back: "Context API é uma funcionalidade do React que permite compartilhar dados entre componentes sem precisar passar props manualmente através de cada nível da árvore de componentes.",
    tags: ["react", "context", "state-management"],
    repetitions: 3,
    interval: 15,
    easeFactor: 2.8,
    nextReviewDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // Atrasado 1 dia
    lastReviewed: new Date(Date.now() - 16 * 24 * 60 * 60 * 1000),
    isNew: false,
  },
];

const fetchFlashcards = async (deckId) => {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockFlashcards;
};

export function Deck({ deckId = 1 }) {
  const [flashcards, setFlashcards] = useState([]);
  const [currentCard, setCurrentCard] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [sessionStats, setSessionStats] = useState({
    reviewed: 0,
    correct: 0,
    startTime: new Date(),
  });

  const {
    data: initialFlashcards,
    isLoading,
    error,
  } = useQuery(["flashcards", deckId], () => fetchFlashcards(deckId));

  // Inicializar flashcards quando os dados chegarem
  useEffect(() => {
    if (initialFlashcards) {
      setFlashcards(initialFlashcards);
      selectNextCard(initialFlashcards);
    }
  }, [initialFlashcards]);

  // Função para determinar prioridade do card (algoritmo do Anki)
  const getCardPriority = useCallback((card) => {
    const now = new Date();
    const daysSinceReview = card.nextReviewDate
      ? Math.floor((now - card.nextReviewDate) / (1000 * 60 * 60 * 24))
      : 0;

    // Cards novos têm prioridade baixa
    if (card.isNew) return 1;

    // Cards atrasados têm prioridade alta
    if (daysSinceReview > 0) return 3 + daysSinceReview;

    // Cards para revisar hoje
    if (daysSinceReview === 0) return 2;

    // Cards futuros têm prioridade muito baixa
    return 0.1;
  }, []);

  // Selecionar próximo card baseado na lógica do Anki
  const selectNextCard = useCallback(
    (cards) => {
      const availableCards = cards.filter((card) => {
        const now = new Date();
        const isReady =
          !card.nextReviewDate || card.nextReviewDate <= now || card.isNew;
        return isReady;
      });

      if (availableCards.length === 0) {
        setCurrentCard(null);
        return;
      }

      // Ordenar por prioridade (maior prioridade primeiro)
      const sortedCards = availableCards.sort((a, b) => {
        const priorityA = getCardPriority(a);
        const priorityB = getCardPriority(b);

        if (priorityA !== priorityB) {
          return priorityB - priorityA;
        }

        // Desempate por facilidade (cards mais difíceis primeiro)
        return a.easeFactor - b.easeFactor;
      });

      setCurrentCard(sortedCards[0]);
      setShowAnswer(false);
    },
    [getCardPriority]
  );

  // Memoizações para performance
  const cardStats = useMemo(() => {
    if (!flashcards.length) return { new: 0, learning: 0, review: 0, total: 0 };

    const now = new Date();
    return flashcards.reduce(
      (acc, card) => {
        acc.total++;

        if (card.isNew) {
          acc.new++;
        } else if (card.repetitions <= 2) {
          acc.learning++;
        } else if (card.nextReviewDate <= now) {
          acc.review++;
        }

        return acc;
      },
      { new: 0, learning: 0, review: 0, total: 0 }
    );
  }, [flashcards]);

  const availableCardsCount = useMemo(() => {
    const now = new Date();
    return flashcards.filter(
      (card) => !card.nextReviewDate || card.nextReviewDate <= now || card.isNew
    ).length;
  }, [flashcards]);

  // Função para processar resposta do usuário
  const handleAnswer = useCallback(
    (quality) => {
      if (!currentCard) return;

      const updatedCard = {
        ...currentCard,
        ...calculateSm2(
          quality,
          currentCard.repetitions,
          currentCard.easeFactor,
          currentCard.interval
        ),
        lastReviewed: new Date(),
        isNew: false,
      };

      const updatedFlashcards = flashcards.map((card) =>
        card.id === currentCard.id ? updatedCard : card
      );

      setFlashcards(updatedFlashcards);
      setSessionStats((prev) => ({
        ...prev,
        reviewed: prev.reviewed + 1,
        correct: prev.correct + (quality >= 3 ? 1 : 0),
      }));

      // Selecionar próximo card
      selectNextCard(updatedFlashcards);
    },
    [currentCard, flashcards, selectNextCard]
  );

  // Reset da sessão
  const resetSession = useCallback(() => {
    if (initialFlashcards) {
      setFlashcards(initialFlashcards);
      selectNextCard(initialFlashcards);
      setSessionStats({
        reviewed: 0,
        correct: 0,
        startTime: new Date(),
      });
    }
  }, [initialFlashcards, selectNextCard]);

  // Navegação por teclado
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA")
        return;

      switch (e.key) {
        case " ":
        case "Enter":
          e.preventDefault();
          setShowAnswer((prev) => !prev);
          break;
        case "1":
          if (showAnswer) handleAnswer(1);
          break;
        case "2":
          if (showAnswer) handleAnswer(2);
          break;
        case "3":
          if (showAnswer) handleAnswer(3);
          break;
        case "4":
          if (showAnswer) handleAnswer(4);
          break;
        case "5":
          if (showAnswer) handleAnswer(5);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showAnswer, handleAnswer]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="space-y-4 text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-primary border-b-2" />
          <p className="text-muted-foreground">Carregando flashcards...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Alert className="max-w-md" variant="destructive">
          <AlertDescription>
            Erro ao carregar flashcards. Tente novamente.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (!currentCard) {
    return (
      <div className="min-h-screen bg-background p-4">
        <div className="mx-auto max-w-2xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-center">🎉 Parabéns!</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-center">
              <p>Você completou todas as revisões por hoje!</p>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-muted p-3">
                  <div className="font-medium">Cards Revisados</div>
                  <div className="font-bold text-2xl text-primary">
                    {sessionStats.reviewed}
                  </div>
                </div>
                <div className="rounded-lg bg-muted p-3">
                  <div className="font-medium">Taxa de Acerto</div>
                  <div className="font-bold text-2xl text-green-600">
                    {sessionStats.reviewed > 0
                      ? Math.round(
                          (sessionStats.correct / sessionStats.reviewed) * 100
                        )
                      : 0}
                    %
                  </div>
                </div>
              </div>
              <Button className="w-full" onClick={resetSession}>
                <RotateCcw className="mr-2 h-4 w-4" />
                Reiniciar Sessão
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="mx-auto max-w-2xl space-y-6">
        <Button>
          <Link to={"/decks"}>Voltar</Link>
        </Button>
        {/* Header com estatísticas */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Deck de Estudos</CardTitle>
              <Button onClick={resetSession} size="sm" variant="outline">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4 grid grid-cols-4 gap-4">
              <div className="text-center">
                <div className="font-bold text-2xl text-blue-600">
                  {cardStats.new}
                </div>
                <div className="text-muted-foreground text-xs">Novos</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-red-600">
                  {cardStats.learning}
                </div>
                <div className="text-muted-foreground text-xs">Aprendendo</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl text-green-600">
                  {cardStats.review}
                </div>
                <div className="text-muted-foreground text-xs">Revisar</div>
              </div>
              <div className="text-center">
                <div className="font-bold text-2xl">{availableCardsCount}</div>
                <div className="text-muted-foreground text-xs">Disponíveis</div>
              </div>
            </div>

            {sessionStats.reviewed > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progresso da Sessão</span>
                  <span>{sessionStats.reviewed} cards revisados</span>
                </div>
                <Progress
                  className="h-2"
                  value={(sessionStats.correct / sessionStats.reviewed) * 100}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card principal */}
        <Card className="relative overflow-hidden">
          {/* Indicador de status do card */}
          <div className="absolute top-0 right-0 left-0 h-1">
            <div
              className={`h-full ${
                currentCard.isNew
                  ? "bg-blue-500"
                  : currentCard.repetitions <= 2
                    ? "bg-red-500"
                    : "bg-green-500"
              }`}
            />
          </div>

          <CardHeader>
            <div className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="text-muted-foreground text-sm">
                  Facilidade: {currentCard.easeFactor.toFixed(1)} | Repetições:{" "}
                  {currentCard.repetitions} | Intervalo: {currentCard.interval}d
                </div>
                <div className="flex flex-wrap gap-1">
                  {currentCard.tags?.map((tag) => (
                    <Badge className="text-xs" key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <Badge
                variant={
                  currentCard.isNew
                    ? "default"
                    : currentCard.repetitions <= 2
                      ? "destructive"
                      : "secondary"
                }
              >
                {currentCard.isNew
                  ? "Novo"
                  : currentCard.repetitions <= 2
                    ? "Aprendendo"
                    : "Revisão"}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Pergunta */}
            <div className="text-center">
              <div className="flex min-h-[100px] items-center justify-center font-medium text-lg leading-relaxed">
                {currentCard.front}
              </div>
            </div>

            {/* Resposta */}
            {showAnswer && (
              <div className="space-y-4 border-t pt-6">
                <div className="text-muted-foreground leading-relaxed">
                  {currentCard.back}
                </div>

                {/* Botões de dificuldade */}
                <div className="space-y-3">
                  <div className="text-center font-medium text-sm">
                    Como foi a dificuldade?
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      className="justify-start border-red-200 text-red-500 hover:bg-red-50"
                      onClick={() => handleAnswer(1)}
                      variant="outline"
                    >
                      <span className="mr-2">1</span>
                      <div className="text-left">
                        <div className="font-medium">Novamente</div>
                      </div>
                    </Button>
                    <Button
                      className="justify-start border-orange-200 text-orange-500 hover:bg-orange-50"
                      onClick={() => handleAnswer(2)}
                      variant="outline"
                    >
                      <span className="mr-2">2</span>
                      <div className="text-left">
                        <div className="font-medium">Difícil</div>
                      </div>
                    </Button>
                    <Button
                      className="justify-start border-blue-200 text-blue-500 hover:bg-blue-50"
                      onClick={() => handleAnswer(3)}
                      variant="outline"
                    >
                      <span className="mr-2">3</span>
                      <div className="text-left">
                        <div className="font-medium">Bom</div>
                      </div>
                    </Button>
                    <Button
                      className="justify-start border-green-200 text-green-500 hover:bg-green-50"
                      onClick={() => handleAnswer(4)}
                      variant="outline"
                    >
                      <span className="mr-2">4</span>
                      <div className="text-left">
                        <div className="font-medium">Fácil</div>
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Botão mostrar resposta */}
            {!showAnswer && (
              <div className="text-center">
                <Button className="w-full" onClick={() => setShowAnswer(true)}>
                  <Eye className="mr-2 h-4 w-4" />
                  Mostrar Resposta
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Instruções */}
        <Card>
          <CardContent className="pt-6">
            <div className="space-y-1 text-muted-foreground text-sm">
              <div className="mb-2 font-medium">Atalhos de Teclado:</div>
              <div className="grid grid-cols-2 gap-1">
                <div>Espaço/Enter: Mostrar resposta</div>
                <div>1-4: Avaliar dificuldade</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
