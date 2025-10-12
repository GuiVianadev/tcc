import { DrizzleUsersRepository } from "../../repositories/drizzle/drizzle-users-repository.ts";
import { UpdateUserService } from "../users/update.ts";

export function makeUpdateUser() {
  const userRepository = new DrizzleUsersRepository();
  const updateProfileService = new UpdateUserService(userRepository);
  return updateProfileService;
}
