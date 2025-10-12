import { hash } from "bcryptjs";
import type { InferInsertModel, InferSelectModel } from "drizzle-orm";
import type { users } from "@/db/schema.ts";
import type { UserRepository } from "@/repositories/users-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error.ts";

type UpdateUserServiceRequest = {
  userId: string;
  targetUserId: string;
  name?: string;
  email?: string;
  password?: string;
};

type UpdateUserServiceResponse = {
  user: InferInsertModel<typeof users>;
};

export class UpdateUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    userId,
    targetUserId,
    name,
    email,
    password,
  }: UpdateUserServiceRequest): Promise<UpdateUserServiceResponse> {
    const SALT_HASH = 6;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new NotFoundError();
    }

    if (user.deleted_at) {
      throw new NotFoundError();
    }

    if (userId !== targetUserId) {
      throw new UnauthorizedError();
    }

    if (email && email !== user.email) {
      const userWithSameEmail = await this.userRepository.findByEmail(email);

      if (userWithSameEmail) {
        throw new UserAlreadyExistsError();
      }
    }

    const dataToUpdate: Partial<InferSelectModel<typeof users>> = {};

    if (name) {
      dataToUpdate.name = name;
    }
    if (email) {
      dataToUpdate.email = email;
    }
    if (password) {
      dataToUpdate.password_hashed = await hash(password, SALT_HASH);
    }
    const userUpdated = await this.userRepository.updateUser(
      userId,
      dataToUpdate
    );

    return { user: userUpdated };
  }
}
