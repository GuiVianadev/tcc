import { DrizzleUsersRepository } from "../../repositories/drizzle/drizzle-users-repository.ts";
import { AutheticateUserService } from "../users/autheticate.ts";

export function makeAutheticateUser() {
  const userRepository = new DrizzleUsersRepository();
  const autheticateUserService = new AutheticateUserService(userRepository);
  return autheticateUserService;
}
