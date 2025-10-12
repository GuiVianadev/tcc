import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";
import { GetUsersService } from "../../users/get-users.ts";

export function makeGetUsers() {
  const userRepository = new DrizzleUsersRepository();
  const getUsersService = new GetUsersService(userRepository);
  return getUsersService;
}
