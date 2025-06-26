import { AppError } from "@/errors/AppError";
import { prisma } from "@/lib/prisma";
import { HttpStatus } from "../../errors/HttpStatus";
import type { CreateAccountInput } from "./account.schema";

export class AccountService {
  async create(input: CreateAccountInput) {
    const { name, type, userId } = input;

    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    const account = await prisma.account.create({
      data: {
        name,
        type,
        userId,
      },
    });

    return account;
  }

  async getBalance(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        balance: true,
        type: true,
      },
    });

    if (accounts.length === 0) {
      throw new AppError("No accounts found for user", HttpStatus.NOT_FOUND);
    }

    return accounts;
  }

  async getAllAccounts(userId: string) {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!userExists) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }

    const accounts = await prisma.account.findMany({
      where: { userId },
      include: {
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
          take: 5,
        },
      },
    });

    return accounts;
  }

  async getAccountById(accountId: string, userId: string) {
    const account = await prisma.account.findFirst({
      where: {
        id: accountId,
        userId,
      },
      include: {
        transactions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!account) {
      throw new AppError("Account not found", HttpStatus.NOT_FOUND);
    }

    return account;
  }

  async getTotalBalance(userId: string) {
    const accounts = await prisma.account.findMany({
      where: { userId },
      select: {
        balance: true,
      },
    });

    if (accounts.length === 0) {
      throw new AppError("No accounts found for user", HttpStatus.NOT_FOUND);
    }

    const totalBalance = accounts.reduce((total, account) => {
      return total + Number(account.balance);
    }, 0);

    return { totalBalance };
  }
}
