import { AccountType } from "@prisma/client";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

const _accountSummarySchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.nativeEnum(AccountType),
  balance: z.number(),
  transactionsCount: z.number(),
});

const _recentTransactionSchema = z.object({
  id: z.string(),
  value: z.number(),
  createdAt: z.string(),
  accountName: z.string(),
  accountType: z.nativeEnum(AccountType),
});

export const _dashboardResponseSchema = z.object({
  user: z.object({
    id: z.string(),
    name: z.string(),
    email: z.string(),
    createdAt: z.string(),
  }),
  totalBalance: z.number(),
  accounts: z.object({
    total: z.number(),
    checking: z.number(),
    saving: z.number(),
    list: z.array(_accountSummarySchema),
  }),
  recentTransactions: z.array(_recentTransactionSchema),
  summary: z.object({
    checkingBalance: z.number(),
    savingBalance: z.number(),
  }),
});

export const dashboardResponseSchema = {
  $id: "dashboardResponseSchema",
  ...zodToJsonSchema(_dashboardResponseSchema),
};
