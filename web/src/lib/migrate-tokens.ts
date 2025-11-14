/**
 * Script de migração para remover tokens do localStorage
 *
 * Este script deve ser executado uma única vez ao carregar a aplicação
 * para limpar tokens armazenados no localStorage antes da migração
 * para o sistema de tokens em memória.
 */

const TOKEN_KEY = "@cognitio:token";

export function migrateTokensToMemory(): void {
  try {
    const oldToken = localStorage.getItem(TOKEN_KEY);
    if (oldToken) {
      localStorage.removeItem(TOKEN_KEY);
    }
  } catch (error) {
    // Silently fail
  }
}
