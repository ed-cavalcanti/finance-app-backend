import { $ref } from "@/app";
import { UserService } from "@/modules/user";
import { type FastifyInstance } from "fastify";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";

export async function authRoutes(app: FastifyInstance) {
  const userService = new UserService();
  const authService = new AuthService(app, userService);
  const authController = new AuthController(authService, userService);

  app.post(
    "/login",
    {
      schema: {
        summary: "Login a registered user",
        tags: ["Auth"],
        body: $ref("loginSchema"),
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
    authController.loginHandler.bind(authController)
  );

  app.log.info("Auth routes registered");
}
