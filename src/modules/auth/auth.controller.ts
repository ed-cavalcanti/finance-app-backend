import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import type { CreateUserInput, UserService } from "@/modules/user";
import { FastifyReply, FastifyRequest } from "fastify";
import type { LoginInputSchema } from "./auth.schema";
import { AuthService } from "./auth.service";
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService
  ) {}

  async registerUserHandler(
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

  async loginHandler(
    request: FastifyRequest<{ Body: LoginInputSchema }>,
    reply: FastifyReply
  ) {
    try {
      const tokens = await this.authService.login(request.body);
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
}
