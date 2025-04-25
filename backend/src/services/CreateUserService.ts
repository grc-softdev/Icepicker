import prismaClient from "../prisma";
interface CreateUserRequest {
  name: string;
}
class CreateUSerService {
  async execute({ name }: CreateUserRequest) {
    const user = await prismaClient.user.create({
      data: {
        name: name,
      },
    });

    return user;
  }
}

export { CreateUSerService };
