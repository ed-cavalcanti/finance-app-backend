import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import type { FastifyReply, FastifyRequest } from "fastify";
import type { DashboardService } from "./dashboard.service";

export class DashboardController {
  constructor(private dashboardService: DashboardService) {}

  async getDashbaordDataHandler(
    request: FastifyRequest<{ Params: { userId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { userId } = request.params;
      const data = await this.dashboardService.getData(userId);
      reply.status(HttpStatus.OK).send(data);
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
