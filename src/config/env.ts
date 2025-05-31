import fastifyEnv from "@fastify/env";
import fp from "fastify-plugin";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

const schema = z.object({
  DATABASE_URL: z.string(),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
});

declare module "fastify" {
  interface FastifyInstance {
    config: z.infer<typeof schema>;
  }
}

export default fp(async (fastify) => {
  await fastify.register(fastifyEnv, {
    confKey: "config",
    schema: zodToJsonSchema(schema),
    dotenv: true,
  });
});
