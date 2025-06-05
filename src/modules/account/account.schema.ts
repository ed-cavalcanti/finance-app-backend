import { AccountType } from "@prisma/client";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

export const AccountTypeSchema = z.nativeEnum(AccountType);

const _createAccountSchema = z.object({
  name: z.string(),
  type: AccountTypeSchema,
  userId: z.string(),
});
export const createAccountSchema = {
  $id: "createAccountSchema",
  ...zodToJsonSchema(_createAccountSchema),
};
export type CreateAccountInput = z.infer<typeof _createAccountSchema>;

const _createAccountResponseSchema = z.object({
  name: z.string(),
  type: AccountTypeSchema,
  userId: z.string(),
  id: z.string(),
  balance: z.number(),
  createdAt: z.string(),
  updatedAt: z.string(),
});
export const createAccountResponseSchema = {
  $id: "createAccountResponseSchema",
  ...zodToJsonSchema(_createAccountResponseSchema),
};
