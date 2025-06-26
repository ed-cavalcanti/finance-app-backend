import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import { prisma } from "@/lib/prisma";
import type { CreateTransactionInput } from "./transaction.schema";

export class TransactionService {
  async create({
    accountId,
    value,
    userId,
  }: CreateTransactionInput & { userId: string }) {
    console.log(accountId, value, userId);
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId: userId,
      },
    });

    if (!account) {
      throw new AppError(
        "Account not found or does not belong to user",
        HttpStatus.FORBIDDEN
      );
    }

    const [transaction, updatedAccount] = await prisma.$transaction([
      prisma.transaction.create({
        data: {
          accountId,
          value,
        },
      }),
      prisma.account.update({
        where: { id: accountId },
        data: {
          balance: {
            increment: value,
          },
        },
      }),
    ]);

    return {
      accountId: transaction.accountId,
      value: transaction.value,
      id: transaction.id,
      createdAt: transaction.createdAt,
      updatedBalance: updatedAccount.balance,
    };
  }
}
