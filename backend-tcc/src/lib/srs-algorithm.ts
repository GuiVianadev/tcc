export type Difficulty = "again" | "hard" | "good" | "easy";

export type SM2Input = {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  difficulty: Difficulty;
};

export type SM2Output = {
  ease_factor: number;
  interval_days: number;
  repetitions: number;
  next_review: Date;
};

/**
 * Converte dificuldade em qualidade numérica (0-5)
 * again = 0 (errou completamente)
 * hard = 2 (difícil, mas lembrou)
 * good = 3 (lembrou bem)
 * easy = 4 (muito fácil)
 */
function difficultyToQuality(difficulty: Difficulty): number {
  const qualityMap: Record<Difficulty, number> = {
    again: 0,
    hard: 2,
    good: 3,
    easy: 4,
  };
  return qualityMap[difficulty];
}

/**
 * Calcula o próximo intervalo de revisão usando o algoritmo SM-2
 */
export function calculateSM2(input: SM2Input): SM2Output {
  const quality = difficultyToQuality(input.difficulty);
  let { ease_factor, interval_days, repetitions } = input;

  // Se a resposta foi ruim (quality < 3), reinicia o processo
  if (quality < 3) {
    repetitions = 0;
    interval_days = 1;

    // Para "hard" (quality = 2), reduz o ease_factor
    if (quality === 2) {
      ease_factor -= 0.15;
    }
  } else {
    // Resposta boa (quality >= 3)
    // Atualiza o ease_factor baseado na qualidade da resposta
    ease_factor =
      ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));

    // Incrementa repetições
    repetitions += 1;

    // Calcula o novo intervalo
    if (repetitions === 1) {
      interval_days = 1;
    } else if (repetitions === 2) {
      interval_days = 6;
    } else {
      interval_days = Math.round(interval_days * ease_factor);
    }

    // Bônus para respostas "easy"
    if (quality === 4) {
      interval_days = Math.round(interval_days * 1.3);
    }
  }

  // Garante que ease_factor nunca seja menor que 1.3
  ease_factor = Math.max(1.3, ease_factor);

  // Calcula a próxima data de revisão
  const next_review = new Date();
  next_review.setDate(next_review.getDate() + interval_days);

  return {
    ease_factor,
    interval_days,
    repetitions,
    next_review,
  };
}
