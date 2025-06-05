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

    const hasAccount = await prisma.account.findUnique({
      where: { userId },
    });

    if (hasAccount) {
      throw new AppError(
        "User already has an money account",
        HttpStatus.CONFLICT
      );
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
    const balance = await prisma.account.findUnique({
      where: { userId },
      select: {
        balance: true,
      },
    });

    if (!balance) {
      throw new AppError("Account not found", HttpStatus.NOT_FOUND);
    }

    return balance;
  }
}
