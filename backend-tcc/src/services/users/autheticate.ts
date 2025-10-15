import { compare } from "bcryptjs";
import type { InferInsertModel } from "drizzle-orm";
import type { users } from "@/db/schema.ts";
import type { UserRepository } from "@/repositories/users-repository.ts";
import { InvalidCredentialsError } from "../errors/invalid-credentials-error.ts";
import { UserDisabledError } from "../errors/user-desativacted-errors.ts";

type AutheticateServiceRequest = {
  email: string;
  password: string;
};

type AutheticateUserServiceResponse = {
  user: InferInsertModel<typeof users>;
};

export class AutheticateUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    email,
    password,
  }: AutheticateServiceRequest): Promise<AutheticateUserServiceResponse> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new InvalidCredentialsError();
    }

    if (user.deleted_at) {
      throw new UserDisabledError();
    }

    const passwordMatches = await compare(password, user.password_hashed);

    if (!passwordMatches) {
      throw new InvalidCredentialsError();
    }

    return { user };
  }
}
