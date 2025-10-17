import type { UserRepository } from "@/repositories/users-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";
import { ActiveUserError } from "../errors/active-user-errors.ts";

type ReactivateUserServiceRequest = {
  userId: string;
  targetUserId: string;
};

export class ReactivateUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({ userId, targetUserId }: ReactivateUserServiceRequest) {
    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    const targetUser = await this.userRepository.findById(targetUserId);

    if (!targetUser) {
      throw new NotFoundError();
    }

    if(targetUser.deleted_at === null) {
      throw new ActiveUserError();
    }

    if (user.role !== "admin") {
      throw new UnauthorizedError();
    }

    await this.userRepository.reactivateUser(targetUser.id);

    return true;
  }
}
