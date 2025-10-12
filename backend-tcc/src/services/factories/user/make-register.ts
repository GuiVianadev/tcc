import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";
import { RegisterUserService } from "../../users/register-user.ts";

export function makeRegisterUser() {
  const userRepository = new DrizzleUsersRepository();
  const registerUseCase = new RegisterUserService(userRepository);
  return registerUseCase;
}
