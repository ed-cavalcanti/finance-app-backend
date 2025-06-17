import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import type { CreateUserInput, UserService } from "@/modules/user";
import { FastifyReply, FastifyRequest } from "fastify";

export class UserController {
  constructor(private userService: UserService) {}

  async createHandler(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const user = await this.userService.create(request.body);
      return reply.status(HttpStatus.CREATED).send(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        return reply.status(error.code).send({ message: error.message });
      }
      console.error(error);
      return reply
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    }
  }

  async getMeHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.userId;
      const user = await this.userService.findById(userId);
      return reply.status(HttpStatus.OK).send(user);
    } catch (error: any) {
      if (error instanceof AppError) {
        return reply.status(error.code).send({ message: error.message });
      }
      console.error(error);
      return reply
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    }
  }
}
