import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";
import { DeleteUserService } from "../../users/delete.ts";

export function makeDeleteUser() {
  const userRepository = new DrizzleUsersRepository();
  const deleteUserService = new DeleteUserService(userRepository);
  return deleteUserService;
}
