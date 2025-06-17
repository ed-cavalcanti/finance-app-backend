import fastifyJwt from "@fastify/jwt"
import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify"
import fp from "fastify-plugin"

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: { userId: string }
    user: {
      userId: string
    }
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>
  }
}

export default fp(async (fastify: FastifyInstance) => {
  fastify.register(fastifyJwt, {
    secret: fastify.config.JWT_SECRET,
    sign: {
      expiresIn: "7d",
    },
  })

  fastify.decorate(
    "authenticate",
    async (request: FastifyRequest, reply: FastifyReply) => {
      try {
        await request.jwtVerify()
      } catch (err) {
        reply.status(401).send({ message: "Unauthorized", error: err })
      }
    }
  )
})
