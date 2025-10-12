import { DrizzleUsersRepository } from "../../../repositories/drizzle/drizzle-users-repository.ts";
import { GetUserProfileService } from "../../users/get-user-profile.ts";

export function makeGetUserProfile() {
  const userRepository = new DrizzleUsersRepository();
  const getUserProfileService = new GetUserProfileService(userRepository);
  return getUserProfileService;
}
