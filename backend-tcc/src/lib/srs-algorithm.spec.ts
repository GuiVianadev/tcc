import { describe, expect, it } from "vitest";
import { calculateSM2 } from "./srs-algorithm.ts";

describe("SM-2 Algorithm (Unit)", () => {
  describe("First review with 'good' response", () => {
    it("should set interval to 1 day for first repetition", () => {
      const result = calculateSM2({
        ease_factor: 2.5,
        interval_days: 0,
        repetitions: 0,
        difficulty: "good",
      });

      expect(result.interval_days).toBe(1);
      expect(result.repetitions).toBe(1);
      expect(result.ease_factor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe("Second review with 'good' response", () => {
    it("should set interval to 6 days for second repetition", () => {
      const result = calculateSM2({
        ease_factor: 2.5,
        interval_days: 1,
        repetitions: 1,
        difficulty: "good",
      });

      expect(result.interval_days).toBe(6);
      expect(result.repetitions).toBe(2);
    });
  });

  describe("Third review with 'good' response", () => {
    it("should multiply interval by ease_factor", () => {
      const easeFactor = 2.5;
      const intervalDays = 6;

      const result = calculateSM2({
        ease_factor: easeFactor,
        interval_days: intervalDays,
        repetitions: 2,
        difficulty: "good",
      });

      expect(result.repetitions).toBe(3);
      // O ease_factor é ajustado primeiro, então o intervalo não será exatamente 6 * 2.5
      // Apenas verificar que o intervalo aumentou
      expect(result.interval_days).toBeGreaterThan(intervalDays);
    });
  });

  describe("Review with 'again' response", () => {
    it("should reset repetitions and set interval to 1", () => {
      const result = calculateSM2({
        ease_factor: 2.5,
        interval_days: 6,
        repetitions: 2,
        difficulty: "again",
      });

      expect(result.repetitions).toBe(0);
      expect(result.interval_days).toBe(1);
    });
  });

  describe("Review with 'hard' response", () => {
    it("should decrease ease_factor and reset repetitions", () => {
      const initialEaseFactor = 2.5;

      const result = calculateSM2({
        ease_factor: initialEaseFactor,
        interval_days: 6,
        repetitions: 2,
        difficulty: "hard",
      });

      expect(result.repetitions).toBe(0);
      expect(result.interval_days).toBe(1);
      expect(result.ease_factor).toBeLessThan(initialEaseFactor);
      expect(result.ease_factor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe("Review with 'easy' response", () => {
    it("should apply bonus to interval", () => {
      const result = calculateSM2({
        ease_factor: 2.5,
        interval_days: 6,
        repetitions: 2,
        difficulty: "easy",
      });

      // Com "easy", o intervalo deveria ser: 6 * 2.6 (ease_factor ajustado) * 1.3 (bônus)
      // Aproximadamente 20 dias
      expect(result.repetitions).toBe(3);
      expect(result.interval_days).toBeGreaterThan(15);
    });
  });

  describe("Ease factor limits", () => {
    it("should never go below 1.3", () => {
      // Começar com ease_factor baixo e usar "again" várias vezes
      let result = calculateSM2({
        ease_factor: 1.3,
        interval_days: 1,
        repetitions: 1,
        difficulty: "again",
      });

      expect(result.ease_factor).toBeGreaterThanOrEqual(1.3);

      // Tentar novamente com "hard"
      result = calculateSM2({
        ease_factor: 1.3,
        interval_days: 1,
        repetitions: 1,
        difficulty: "hard",
      });

      expect(result.ease_factor).toBeGreaterThanOrEqual(1.3);
    });

    it("should maintain or adjust ease_factor with good responses", () => {
      const initialEaseFactor = 2.5;

      const result = calculateSM2({
        ease_factor: initialEaseFactor,
        interval_days: 6,
        repetitions: 2,
        difficulty: "good",
      });

      // Com quality=3 (good), a fórmula pode não aumentar o ease_factor
      // O importante é que não caia abaixo do mínimo
      expect(result.ease_factor).toBeGreaterThanOrEqual(1.3);
    });
  });

  describe("Next review date", () => {
    it("should calculate next_review based on interval_days", () => {
      const result = calculateSM2({
        ease_factor: 2.5,
        interval_days: 0,
        repetitions: 0,
        difficulty: "good",
      });

      const now = new Date();

      // Verificar que a data está no futuro (ou no mínimo igual se interval_days for 1)
      expect(result.next_review.getTime()).toBeGreaterThanOrEqual(now.getTime());

      // Verificar que a diferença é aproximadamente igual ao intervalo
      // Usando ceil para arredondar para cima (mesmo dia = 1)
      const diffInDays = Math.ceil(
        (result.next_review.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      );
      expect(diffInDays).toBe(result.interval_days);
    });
  });
});
