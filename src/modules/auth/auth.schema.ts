import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

// O arquivo serve para construir os schemas úteis para a rota, exportando ele como JSON e adicionando a propriedade $id para poder registrar o schema corretamente no Fastify.

const _createUserSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  name: z.string(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" }),
});
export const createUserSchema = {
  $id: "createUserSchema",
  ...zodToJsonSchema(_createUserSchema),
};
export type CreateUserInput = z.infer<typeof _createUserSchema>;

const _loginUserSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});
export const loginUserSchema = {
  $id: "loginUserSchema",
  ...zodToJsonSchema(_loginUserSchema),
};
export type LoginUserInput = z.infer<typeof _loginUserSchema>;

const _loginResponseSchema = z.object({
  accessToken: z.string(),
});
export const loginResponseSchema = {
  $id: "loginResponseSchema",
  ...zodToJsonSchema(_loginResponseSchema),
};

const _userResponseSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  name: z.string(),
  createdAt: z.date(),
  updatedAt: z.date(),
});

export const userResponseSchema = {
  $id: "userResponseSchema",
  ...zodToJsonSchema(_userResponseSchema),
};
