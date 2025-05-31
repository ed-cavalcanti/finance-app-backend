import { $ref } from "@/app";
import { type FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
  const authService = new AuthService(app);
  const authController = new AuthController(authService);

  app.post(
    "/register",
    {
      schema: {
        summary: "Register a new user",
        tags: ["Auth"],
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
    authController.registerUserHandler.bind(authController)
  );

  app.post(
    "/login",
    {
      schema: {
        summary: "Login a registered user",
        tags: ["Auth"],
        body: $ref("loginUserSchema"),
        response: {
          200: $ref("loginResponseSchema"),
          401: {
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
    authController.loginUserHandler.bind(authController)
  );
  app.get(
    "/me",
    {
      onRequest: [app.authenticate],
      schema: {
        summary: "Get user info",
        tags: ["Auth"],
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
    authController.getMeHandler.bind(authController)
  );

  app.log.info("Auth routes registered");
}
