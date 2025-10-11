import "@fastify/jwt";

declare module "@fastify/jwt" {
  // biome-ignore lint/nursery/useConsistentTypeDefinitions: <Need be interface >
  export interface FastifyJWT {
    user: {
      sub: string;
      role: "student" | "admin";
    };
  }
}
