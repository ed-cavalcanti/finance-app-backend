import type { FastifyInstance } from "fastify";
import { $ref } from "../../app";
import { AccountService } from "../account/account.service";
import { DashboardController } from "./dashboard.controller";
import { DashboardService } from "./dashboard.service";

interface GetDeshboardRoute {
  Params: { userId: string };
}

export async function dashboardRoutes(app: FastifyInstance) {
  const accountService = new AccountService();
  const dashboardService = new DashboardService(accountService);
  const dashboardController = new DashboardController(dashboardService);
  app.get<GetDeshboardRoute>(
    "/:userId",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Get initial data to render dashboard",
        tags: ["Dashboard"],
        security: [{ bearerAuth: [] }],
        response: {
          200: $ref("dashboardResponseSchema"),
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
    dashboardController.getDashbaordDataHandler.bind(dashboardController)
  );

  app.log.info("Dashboard routes registered");
}
