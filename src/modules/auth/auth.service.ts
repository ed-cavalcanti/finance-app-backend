import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { CreateUserInput, LoginUserInput } from "./auth.schema";

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async createUser(input: CreateUserInput) {
    const { email, password, name } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

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

  async loginUser(input: LoginUserInput) {
    const { email, password } = input;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password", HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.fastify.jwt.sign({ userId: user.id });

    return { accessToken };
  }

  async findUserById(userId: string) {
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
}
