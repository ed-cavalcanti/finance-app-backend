import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const _loginSchema = z.object({
  email: z.string().email({ message: "Invalid email" }),
  password: z.string(),
});
export const loginSchema = {
  $id: "loginSchema",
  ...zodToJsonSchema(_loginSchema),
};
export type LoginInputSchema = z.infer<typeof _loginSchema>;

const _loginResponseSchema = z.object({
  accessToken: z.string(),
});
export const loginResponseSchema = {
  $id: "loginResponseSchema",
  ...zodToJsonSchema(_loginResponseSchema),
};
