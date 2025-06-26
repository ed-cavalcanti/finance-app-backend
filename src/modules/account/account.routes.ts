import type { FastifyInstance } from "fastify";
import { $ref } from "../../app";
import { AccountController } from "./account.controller";
import type { CreateAccountInput } from "./account.schema";
import { AccountService } from "./account.service";

interface CreateAccountRoute {
  Body: CreateAccountInput;
}

interface UserParamsRoute {
  Params: { userId: string };
}

interface AccountParamsRoute {
  Params: { userId: string; accountId: string };
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

  app.get<UserParamsRoute>(
    "/user/:userId",
    {
      onRequest: app.authenticate,
      schema: {
        summary: "Get all accounts for a user",
        tags: ["Account"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            userId: { type: "string" },
          },
          required: ["userId"],
        },
        response: {
          200: {
            type: "array",
            items: $ref("createAccountResponseSchema"),
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    accountController.getAllAccountsHandler.bind(accountController)
  );

  app.get<AccountParamsRoute>(
    "/user/:userId/account/:accountId",
    {
      onRequest: app.authenticate,
      schema: {
        summary: "Get specific account by ID",
        tags: ["Account"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            userId: { type: "string" },
            accountId: { type: "string" },
          },
          required: ["userId", "accountId"],
        },
        response: {
          200: $ref("createAccountResponseSchema"),
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    accountController.getAccountByIdHandler.bind(accountController)
  );

  app.get<UserParamsRoute>(
    "/user/:userId/balance",
    {
      onRequest: app.authenticate,
      schema: {
        summary: "Get balance of all user accounts",
        tags: ["Account"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            userId: { type: "string" },
          },
          required: ["userId"],
        },
        response: {
          200: {
            type: "array",
            items: {
              type: "object",
              properties: {
                id: { type: "string" },
                name: { type: "string" },
                balance: { type: "number" },
                type: { type: "string" },
              },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    accountController.getBalanceHandler.bind(accountController)
  );

  app.get<UserParamsRoute>(
    "/user/:userId/total-balance",
    {
      onRequest: app.authenticate,
      schema: {
        summary: "Get total balance across all user accounts",
        tags: ["Account"],
        security: [{ bearerAuth: [] }],
        params: {
          type: "object",
          properties: {
            userId: { type: "string" },
          },
          required: ["userId"],
        },
        response: {
          200: {
            type: "object",
            properties: {
              totalBalance: { type: "number" },
            },
          },
          404: {
            type: "object",
            properties: {
              message: { type: "string" },
            },
          },
        },
      },
    },
    accountController.getTotalBalanceHandler.bind(accountController)
  );

  app.log.info("Account routes registered");
}
