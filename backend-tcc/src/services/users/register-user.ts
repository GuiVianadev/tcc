import { hash } from "bcryptjs";
import type { InferInsertModel } from "drizzle-orm";
import type { users } from "@/db/schema.ts";
import type { UserRepository } from "@/repositories/users-repository.ts";
import { UserAlreadyExistsError } from "../errors/user-already-exists-error.ts";

type RegisterUserServiceRequest = {
  name: string;
  email: string;
  password: string;
};

type RegisterUserServiceResponse = {
  user: InferInsertModel<typeof users>;
};

export class RegisterUserService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    name,
    email,
    password,
  }: RegisterUserServiceRequest): Promise<RegisterUserServiceResponse> {
    const SALT_HASH = 6;

    const userWithSameEmail = await this.userRepository.findByEmail(email);

    if (userWithSameEmail) {
      throw new UserAlreadyExistsError();
    }

    const password_hashed = await hash(password, SALT_HASH);
    const user = await this.userRepository.create({
      name,
      email,
      password_hashed,
    });

    return { user };
  }
}
