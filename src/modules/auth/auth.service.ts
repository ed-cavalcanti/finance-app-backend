import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import { CreateUserInput, LoginUserInput } from "./auth.schema";

export class AuthService {
  constructor(private fastify: FastifyInstance) {}

  async createUser(input: CreateUserInput) {
    const { email, password } = input;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new Error("Email already registered");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
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
      throw new Error("Invalid email or password");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new Error("Invalid email or password");
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
        createdAt: true,
        updatedAt: true,
      },
    });
    if (!user) {
      throw new Error("User not found");
    }
    return user;
  }
}
