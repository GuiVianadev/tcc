import { ReactivateUserService } from "@/services/users/reactivate.ts";
import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";

export function makeReactivateUser() {
  const userRepository = new DrizzleUsersRepository();
  const reactivateUserService = new ReactivateUserService(userRepository);
  return reactivateUserService;
}
