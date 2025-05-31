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
      return reply.status(201).send(user);
    } catch (error: any) {
      if (error.message.includes("Email already registered")) {
        return reply.status(409).send({ message: error.message });
      }
      console.error(error);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async loginUserHandler(
    request: FastifyRequest<{ Body: LoginUserInput }>,
    reply: FastifyReply
  ) {
    try {
      const tokens = await this.authService.loginUser(request.body);
      return reply.status(200).send(tokens);
    } catch (error: any) {
      if (error.message.includes("Invalid")) {
        return reply.status(401).send({ message: error.message });
      }
      console.error(error);
      return reply.status(500).send({ message: "Internal server error" });
    }
  }

  async getMeHandler(request: FastifyRequest, reply: FastifyReply) {
    try {
      const userId = request.user.userId;
      const user = await this.authService.findUserById(userId);
      return reply.status(200).send(user);
    } catch (error: any) {
      console.error(error);
      if (error.message.includes("not found")) {
        return reply.status(404).send({ message: error.message });
      }
      return reply.status(500).send({ message: "Internal server error" });
    }
  }
}
