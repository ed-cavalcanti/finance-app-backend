import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import { prisma } from "@/lib/prisma";
import { CreateUserInput } from "@/modules/user/user.schema";
import bcrypt from "bcryptjs";

export class UserService {
  constructor() {}

  async create(input: CreateUserInput) {
    const { email, password, name } = input;

    const existingUser = await this.findByEmail(email);

    if (existingUser) {
      throw new AppError("Email already registered", HttpStatus.CONFLICT);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async findById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }
    return user;
  }

  async findByEmail(email: string, getPassword: boolean = false) {
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
        updatedAt: true,
        password: getPassword,
      },
    });
    if (!user) {
      throw new AppError("User not found", HttpStatus.NOT_FOUND);
    }
    return user;
  }
}
