import type {
  PaginatedUsers,
  UserRepository,
} from "@/repositories/users-repository.ts";
import { NotFoundError } from "../errors/not-found.error.ts";
import { UnauthorizedError } from "../errors/unauthorized-error.ts";

type GetUsersServiceRequest = {
  requestingUserId: string;
  page: number;
  pageSize: number;
};

type GetUsersServiceResponse = PaginatedUsers;

export class GetUsersService {
  private readonly userRepository: UserRepository;

  constructor(userRepository: UserRepository) {
    this.userRepository = userRepository;
  }

  async execute({
    requestingUserId,
    page,
    pageSize,
  }: GetUsersServiceRequest): Promise<GetUsersServiceResponse> {
    const requestingUser = await this.userRepository.findById(requestingUserId);

    if (!requestingUser) {
      throw new NotFoundError();
    }

    if (requestingUser.role !== "admin") {
      throw new UnauthorizedError();
    }

    const result = await this.userRepository.findUsers(page, pageSize);

    return result;
  }
}
