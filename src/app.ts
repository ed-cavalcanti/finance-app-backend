import fastifySensible from "@fastify/sensible";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUI from "@fastify/swagger-ui";
import Fastify, {
  FastifyInstance,
  FastifyReply,
  FastifyRequest,
} from "fastify";
import { ZodError } from "zod";

import envPlugin from "./config/env";
import { HttpStatus } from "./errors/HttpStatus";
import { accountRoutes } from "./modules/account/account.routes";
import {
  createAccountResponseSchema,
  createAccountSchema,
} from "./modules/account/account.schema";
import { authRoutes } from "./modules/auth/auth.routes";
import {
  createUserSchema,
  loginResponseSchema,
  loginUserSchema,
  userResponseSchema,
} from "./modules/auth/auth.schema";
import { dashboardRoutes } from "./modules/dashboard/dashboard.routes";
import { dashboardResponseSchema } from "./modules/dashboard/dashboard.schema";
import jwtPlugin from "./plugins/jwt";

export function buildJsonSchemas() {
  const models = {
    createUserSchema,
    loginUserSchema,
    userResponseSchema,
    loginResponseSchema,
    createAccountSchema,
    createAccountResponseSchema,
    dashboardResponseSchema,
  };
  return {
    models,
    $ref: (modelName: keyof typeof models) => ({ $ref: `${modelName}#` }),
  };
}

export const { $ref } = buildJsonSchemas();

export async function buildApp(opts = {}): Promise<FastifyInstance> {
  const app = Fastify(opts);

  await app.register(envPlugin);
  await app.register(jwtPlugin);
  await app.register(fastifySensible);

  for (const schema of Object.values(buildJsonSchemas().models)) {
    app.addSchema(schema);
  }

  await app.register(fastifySwagger, {
    openapi: {
      info: {
        title: "Finance app API",
        version: "0.0.2",
      },
      components: {
        securitySchemes: {
          bearerAuth: {
            type: "http",
            scheme: "bearer",
            bearerFormat: "JWT",
          },
        },
      },
      security: [{ bearerAuth: [] }],
    },
  });

  await app.register(fastifySwaggerUI, {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: false,
    },
  });

  app.register(authRoutes, { prefix: "/api/v1/auth" });
  app.register(accountRoutes, { prefix: "/api/v1/accounts" });
  app.register(dashboardRoutes, { prefix: "/api/v1/dashboard" });

  app.setErrorHandler(
    (error, _request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof ZodError) {
        return reply.status(HttpStatus.BAD_REQUEST).send({
          message: "Validation error",
          errors: error.flatten().fieldErrors,
        });
      }
      if (error.validation) {
        return reply
          .status(HttpStatus.BAD_REQUEST)
          .send({ message: "Validation error", errors: error.validation });
      }

      app.log.error(error);
      return reply
        .status(HttpStatus.INTERNAL_SERVER_ERROR)
        .send({ message: "Internal server error" });
    }
  );

  app.get("/healthcheck", async () => {
    return { status: "ok" };
  });

  return app;
}
