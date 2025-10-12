import type { UserRepository } from "@/repositories/users-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

type DeleteUserServiceRequest = {
  userId: string;
  targetUserId: string;
};

export class DeleteUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId, targetUserId }: DeleteUserServiceRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    const targetUser = await this.userRepository.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError();
    }

    if (user.id !== targetUser.id && user.role !== "admin") {
      throw new UnauthorizedError();
    }

    await this.userRepository.deleteUser(targetUser.id);

    return true;
  }
}
