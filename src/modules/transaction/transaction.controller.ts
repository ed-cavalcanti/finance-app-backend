import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { CreateTransactionInput } from "./transaction.schema";
import type { TransactionService } from "./transaction.service";

export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  async createTransactionHandler(
    request: FastifyRequest<{ Body: CreateTransactionInput }>,
    reply: FastifyReply
  ) {
    try {
      const userId = request.user.userId;
      const { accountId, value } = request.body;
      console.log(userId)
      const response = await this.transactionService.create({
        accountId,
        value,
        userId,
      });
      reply.status(HttpStatus.OK).send(response);
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
