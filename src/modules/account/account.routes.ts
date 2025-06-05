import type { FastifyInstance } from "fastify";
import { $ref } from "../../app";
import { AccountController } from "./account.controller";
import type { CreateAccountInput } from "./account.schema";
import { AccountService } from "./account.service";

// Interface para definir os tipos da rota
interface CreateAccountRoute {
  Body: CreateAccountInput;
}

export async function accountRoutes(app: FastifyInstance) {
  const accountService = new AccountService();
  const accountController = new AccountController(accountService);
  app.post<CreateAccountRoute>(
    "/create",
    {
      onRequest: app.authenticate,
      schema: {
        summary: "Create a new account",
        tags: ["Account"],
        security: [{ bearerAuth: [] }],
        body: $ref("createAccountSchema"),
        response: {
          201: $ref("createAccountResponseSchema"),
          409: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
          500: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    accountController.createAccountHandler.bind(accountController)
  );

  app.log.info("Account routes registered");
}
