import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import { FastifyReply, FastifyRequest } from "fastify";
import { CreateUserInput, LoginUserInput } from "./auth.schema";
import { AuthService } from "./auth.service";

export class AuthController {
  constructor(private authService: AuthService) {}

  async registerUserHandler(
    request: FastifyRequest<{ Body: CreateUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const user = await this.authService.createUser(request.body);
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

  async loginUserHandler(
    request: FastifyRequest<{ Body: LoginUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const tokens = await this.authService.loginUser(request.body);
      return reply.status(HttpStatus.OK).send(tokens);
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
      const user = await this.authService.findUserById(userId);
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
