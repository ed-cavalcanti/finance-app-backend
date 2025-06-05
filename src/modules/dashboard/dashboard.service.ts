import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import { prisma } from "@/lib/prisma";
import type { AccountService } from "../account/account.service";

export class DashboardService {
  constructor(private accountService: AccountService) {}

  async getData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new AppError("User not found for dashboard", HttpStatus.NOT_FOUND);
    }

    const accountBalanceData = await this.accountService.getBalance(userId);

    if (!accountBalanceData) {
      throw new AppError(
        "Account balance not found or invalid for dashboard",
        HttpStatus.NOT_FOUND
      );
    }

    return {
      ...user,
      balance: accountBalanceData.balance,
    };
  }
}
