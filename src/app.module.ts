import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './auth/guards/accessToken.guard';
import { dbConfig } from './config/db.config';
import jwtConfig from './config/jwt.config';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [jwtConfig],
      envFilePath: [`.${process.env.NODE_ENV}.env`],
    }),
    TypeOrmModule.forRoot(dbConfig),
    UsersModule,
    ProjectsModule,
    AuthModule,
    TasksModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_GUARD,
      useClass: AccessTokenGuard,
    },
  ],
})
export class AppModule {}
