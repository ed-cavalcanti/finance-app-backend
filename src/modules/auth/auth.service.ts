import { AppError } from "@/errors/AppError";
import { HttpStatus } from "@/errors/HttpStatus";
import type { UserService } from "@/modules/user";
import bcrypt from "bcryptjs";
import { FastifyInstance } from "fastify";
import type { LoginInputSchema } from "./auth.schema";

export class AuthService {
  constructor(
    private fastify: FastifyInstance,
    private userService: UserService
  ) {}

  async login(input: LoginInputSchema) {
    const { email, password } = input;

    const user = await this.userService.findByEmail(email, true);

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
}
