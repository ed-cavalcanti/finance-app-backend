import z from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const _createTransactionSchema = z.object({
  accountId: z.string(),
  value: z.number(),
});
export const createTransactionSchema = {
  $id: "createTransactionSchema",
  ...zodToJsonSchema(_createTransactionSchema),
};
export type CreateTransactionInput = z.infer<typeof _createTransactionSchema>;

const _transactionResponseSchema = z.object({
  accountId: z.string(),
  value: z.number(),
  id: z.string(),
  createdAt: z.date(),
  updatedBalance: z.number(),
});

export const transactionResponseSchema = {
  $id: "transactionResponseSchema",
  ...zodToJsonSchema(_transactionResponseSchema),
};
