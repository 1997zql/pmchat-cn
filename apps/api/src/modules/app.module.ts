import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaService } from "../common/prisma.service";
import { JwtStrategy } from "../common/jwt.strategy";
import { RolesGuard } from "../common/roles.guard";
import { AdminModule } from "./admin/admin.module";
import { AuthModule } from "./auth/auth.module";
import { BootstrapService } from "./bootstrap.service";
import { ChatModule } from "./chat/chat.module";
import { CommentsModule } from "./comments/comments.module";
import { NotificationsModule } from "./notifications/notifications.module";
import { PostsModule } from "./posts/posts.module";
import { SearchModule } from "./search/search.module";
import { UsersModule } from "./users/users.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UsersModule,
    PostsModule,
    CommentsModule,
    NotificationsModule,
    SearchModule,
    ChatModule,
    AdminModule
  ],
  providers: [PrismaService, JwtStrategy, BootstrapService, RolesGuard]
})
export class AppModule {}
