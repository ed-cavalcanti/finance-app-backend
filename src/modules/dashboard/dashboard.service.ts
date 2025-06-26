import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import { prisma } from "@/lib/prisma";
import type { AccountService } from "../account/account.service";

export class DashboardService {
  constructor(private accountService: AccountService) {}

  async getData(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new AppError("User not found for dashboard", HttpStatus.NOT_FOUND);
    }
    const totalBalanceData = await this.accountService.getTotalBalance(userId);

    const accounts = await this.accountService.getAllAccounts(userId);

    const accountsCount = accounts.length;
    const checkingAccounts = accounts.filter((acc) => acc.type === "CHECKING");
    const savingAccounts = accounts.filter((acc) => acc.type === "SAVING");

    const recentTransactions = accounts
      .flatMap((account) =>
        account.transactions.map((transaction) => ({
          ...transaction,
          accountName: account.name,
          accountType: account.type,
        }))
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 5);

    return {
      user,
      totalBalance: totalBalanceData.totalBalance,
      accounts: {
        total: accountsCount,
        checking: checkingAccounts.length,
        saving: savingAccounts.length,
        list: accounts.map((account) => ({
          id: account.id,
          name: account.name,
          type: account.type,
          balance: Number(account.balance),
          transactionsCount: account.transactions.length,
        })),
      },
      recentTransactions,
      summary: {
        checkingBalance: checkingAccounts.reduce(
          (sum, acc) => sum + Number(acc.balance),
          0
        ),
        savingBalance: savingAccounts.reduce(
          (sum, acc) => sum + Number(acc.balance),
          0
        ),
      },
    };
  }
}
