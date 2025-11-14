/**
 * Token Manager - Gerencia tokens de acesso em memória
 *
 * Mantém o access token em memória (não em localStorage) para proteção contra XSS.
 * O refresh token permanece em httpOnly cookie gerenciado pelo backend.
 */

let accessToken: string | null = null;

export const tokenManager = {
  /**
   * Define o access token em memória
   */
  setToken(token: string): void {
    accessToken = token;
  },

  /**
   * Obtém o access token da memória
   */
  getToken(): string | null {
    return accessToken;
  },

  /**
   * Remove o access token da memória
   */
  clearToken(): void {
    accessToken = null;
  },

  /**
   * Verifica se existe um token em memória
   */
  hasToken(): boolean {
    return accessToken !== null;
  },
};
