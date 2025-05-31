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
import { authRoutes } from "./modules/auth/auth.routes";
import {
  createUserSchema,
  loginResponseSchema,
  loginUserSchema,
  userResponseSchema,
} from "./modules/auth/auth.schema";
import jwtPlugin from "./plugins/jwt";

export function buildJsonSchemas() {
  const models = {
    createUserSchema,
    loginUserSchema,
    userResponseSchema,
    loginResponseSchema,
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
        version: "0.0.1",
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

  app.register(authRoutes, { prefix: "/api/auth" });

  app.setErrorHandler(
    (error, _request: FastifyRequest, reply: FastifyReply) => {
      if (error instanceof ZodError) {
        return reply.status(400).send({
          message: "Validation error",
          errors: error.flatten().fieldErrors,
        });
      }
      if (error.validation) {
        return reply
          .status(400)
          .send({ message: "Validation error", errors: error.validation });
      }

      app.log.error(error);
      return reply.status(500).send({ message: "Internal server error" });
    }
  );

  app.get("/healthcheck", async () => {
    return { status: "ok" };
  });

  return app;
}
