import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type CardCreateBody, createCard } from "@/api/cards";
import { createDeck, type DeckCreateBody } from "@/api/decks";

export function useDeckMutations() {
  const queryClient = useQueryClient();

  const createDeckWithCards = useMutation({
    mutationFn: async ({
      deck,
      cards = [],
    }: {
      deck: DeckCreateBody;
      cards?: Omit<CardCreateBody, "deck_id">[];
    }) => {
      const createdDeck = await createDeck(deck);

      if (cards.length > 0) {
        await Promise.all(
          cards.map((card) => createCard({ ...card, deck_id: createdDeck.id }))
        );
      }

      return createdDeck;
    },

    onSuccess: (deck) => {
      queryClient.invalidateQueries({ queryKey: ["decks"] });
    },
  });

  return { createDeckWithCards };
}
