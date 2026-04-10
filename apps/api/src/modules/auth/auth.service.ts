import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { PrismaService } from "../../common/prisma.service";
import { ForgotPasswordDto, LoginDto, RegisterDto, ResetPasswordDto } from "./dto";
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (existing) {
      throw new BadRequestException("邮箱已被注册");
    }

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        nickname: dto.nickname,
        passwordHash: await bcrypt.hash(dto.password, 10)
      }
    });

    return this.createSession(user.id, user.email, user.role);
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) {
      throw new UnauthorizedException("邮箱或密码错误");
    }
    if (user.status === "BANNED") {
      throw new UnauthorizedException("账号已被封禁");
    }
    const matched = await bcrypt.compare(dto.password, user.passwordHash);
    if (!matched) {
      throw new UnauthorizedException("邮箱或密码错误");
    }
    return this.createSession(user.id, user.email, user.role);
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        nickname: true,
        role: true,
        status: true,
        bio: true,
        avatarUrl: true,
        title: true,
        company: true,
        yearsOfExp: true,
        interests: true
      }
    });
  }

  async logout(userId: string) {
    await this.prisma.session.deleteMany({ where: { userId } });
    return { success: true };
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    const resetToken = user
      ? this.jwtService.sign({ sub: user.id, action: "reset" }, { expiresIn: "30m" })
      : null;
    return {
      success: true,
      message: user ? "已生成密码重置入口，请继续完成密码更新" : "如邮箱存在，我们已处理你的密码重置请求",
      resetToken,
      resetPath: resetToken ? `/reset-password?token=${encodeURIComponent(resetToken)}` : null
    };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const payload = this.jwtService.verify<{ sub: string; action: string }>(dto.token, {
      secret: this.configService.get<string>("JWT_ACCESS_SECRET", "pmchat_access_secret")
    });
    if (payload.action !== "reset") {
      throw new BadRequestException("无效的重置 token");
    }
    await this.prisma.user.update({
      where: { id: payload.sub },
      data: { passwordHash: await bcrypt.hash(dto.password, 10) }
    });
    await this.prisma.session.deleteMany({ where: { userId: payload.sub } });
    return { success: true };
  }

  private async createSession(userId: string, email: string, role: string) {
    const accessToken = this.jwtService.sign({ sub: userId, email, role }, { expiresIn: "2h" });
    const refreshToken = this.jwtService.sign(
      { sub: userId, email, role, type: "refresh" },
      {
        secret: this.configService.get<string>("JWT_REFRESH_SECRET", "pmchat_refresh_secret"),
        expiresIn: "7d"
      }
    );

    await this.prisma.session.create({
      data: {
        userId,
        refreshToken,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
      }
    });

    return {
      accessToken,
      refreshToken,
      user: await this.me(userId)
    };
  }
}
