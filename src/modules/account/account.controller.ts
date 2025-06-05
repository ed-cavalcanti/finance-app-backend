import type { FastifyReply, FastifyRequest } from "fastify";
import { AppError } from "../../errors/AppError";
import { HttpStatus } from "../../errors/HttpStatus";
import type { CreateAccountInput } from "./account.schema";
import type { AccountService } from "./account.service";

export class AccountController {
  constructor(private accountService: AccountService) {}

  async createAccountHandler(
    request: FastifyRequest<{ Body: CreateAccountInput }>,
    reply: FastifyReply
  ) {
    try {
      const account = await this.accountService.create(request.body);
      return reply.status(HttpStatus.CREATED).send(account);
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
