import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';

ConfigModule.forRoot({
  envFilePath: `.${process.env.NODE_ENV}.env`,
});

const configService = new ConfigService();

export const dbConfig: TypeOrmModuleOptions = {
  type: 'postgres',
  host: configService.get<string>('DB_HOST') || 'localhost',
  port: parseInt(configService.get<string>('DB_PORT')),
  username: configService.get<string>('DB_USERNAME'),
  password: configService.get<string>('DB_PASSWORD'),
  database: configService.get<string>('DB_NAME'),
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true,
  autoLoadEntities: true,
  ssl: process.env.DB_SSL === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  extra: {
    ssl:
      configService.get<string>('DB_SSL') === 'true'
        ? {
            rejectUnauthorized: false,
          }
        : null,
  },
};
