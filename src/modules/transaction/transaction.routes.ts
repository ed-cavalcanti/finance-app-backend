import { $ref } from "@/app";
import type { FastifyInstance } from "fastify";
import { TransactionController } from "./transaction.controller";
import { TransactionService } from "./transaction.service";

interface CreateTransactionRoute {
  Body: {
    value: number;
    accountId: string;
  };
}

export async function transactionRoutes(app: FastifyInstance) {
  const transactionService = new TransactionService();
  const transactionController = new TransactionController(transactionService);

  app.post<CreateTransactionRoute>(
    "/",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Create a transaction for a specified account",
        tags: ["Transaction"],
        security: [{ bearerAuth: [] }],
        body: $ref("createTransactionSchema"),
        response: {
          200: $ref("transactionResponseSchema"),
          401: {
            type: "object",
            properties: { message: { type: "string" } },
          },
          404: {
            type: "object",
            properties: { message: { type: "string" } },
          },
        },
      },
    },
    transactionController.createTransactionHandler.bind(transactionController)
  );

  app.log.info("Transaction routes registered");
}
