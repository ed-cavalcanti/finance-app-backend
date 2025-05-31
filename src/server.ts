import { buildApp } from "./app";
import { prisma } from "./lib/prisma";

async function main() {
  const app = await buildApp({
    logger: {
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
    },
  });

  try {
    await prisma.$connect();
    app.log.info("Connected to database");

    const port = app.config.PORT;
    await app.listen({ port, host: "localhost" });
    app.log.info(`Server running on http://localhost:${port}`);
    app.log.info(`Swagger docs on http://localhost:${port}/docs`);
  } catch (err) {
    app.log.error(err);
    await prisma.$disconnect();
    process.exit(1);
  }
}

main();
