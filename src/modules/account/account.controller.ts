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

  async getAllAccountsHandler(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const accounts = await this.accountService.getAllAccounts(userId);
      return reply.status(HttpStatus.OK).send(accounts);
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

  async getAccountByIdHandler(
    request: FastifyRequest<{ Params: { accountId: string; userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { accountId, userId } = request.params;
      const account = await this.accountService.getAccountById(
        accountId,
        userId
      );
      return reply.status(HttpStatus.OK).send(account);
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

  async getBalanceHandler(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const balance = await this.accountService.getBalance(userId);
      return reply.status(HttpStatus.OK).send(balance);
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

  async getTotalBalanceHandler(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const totalBalance = await this.accountService.getTotalBalance(userId);
      return reply.status(HttpStatus.OK).send(totalBalance);
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
