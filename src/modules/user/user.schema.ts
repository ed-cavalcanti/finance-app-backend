import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";

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

export const _userResponseSchema = z.object({
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
