import type { User, UserRepository } from "@/repositories/users-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";

type GetUserProfileServiceRequest = {
  id: string;
};

type GetUserProfileServiceResponse = {
  user: User;
};

export class GetUserProfileService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    id,
  }: GetUserProfileServiceRequest): Promise<GetUserProfileServiceResponse> {
    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new NotFoundError();
    }
    return {
      user,
    };
  }
}
