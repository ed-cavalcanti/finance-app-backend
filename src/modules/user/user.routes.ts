import { $ref } from "@/app";
import { UserService } from "@/modules/user";
import { type FastifyInstance } from "fastify";
import { UserController } from "./user.controller";

export async function userRoutes(app: FastifyInstance) {
  const userService = new UserService();
  const userController = new UserController(userService);

  app.post(
    "/create",
    {
      schema: {
        summary: "Create a new user",
        tags: ["User"],
        body: $ref("createUserSchema"),
        response: {
          201: $ref("userResponseSchema"),
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
    userController.createHandler.bind(userController)
  );

  app.get(
    "/me",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Get user info",
        tags: ["User"],
        security: [{ bearerAuth: [] }],
        response: {
          200: $ref("userResponseSchema"),
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
    userController.getMeHandler.bind(userController)
  );

  app.log.info("User routes registered");
}
