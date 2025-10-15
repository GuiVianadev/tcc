import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Dados ficam frescos por 5 minutos antes de serem considerados obsoletos
      staleTime: 5 * 60 * 1000,
      // Cache mantido por 10 minutos antes de ser coletado
      gcTime: 10 * 60 * 1000,
      // Tentar novamente 2 vezes em caso de erro
      retry: 2,
      // Não revalidar automaticamente quando a janela ganha foco
      refetchOnWindowFocus: false,
      // Não revalidar quando o componente monta se os dados ainda estão frescos
      refetchOnMount: true,
    },
  },
});
