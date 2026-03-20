import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MessagingWrapperModule } from './common/messaging/messaging-wrapper.module';
import { Environemnt } from './environemnt';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Environemnt.DB_HOST,
      port: Environemnt.DB_PORT,
      username: Environemnt.DB_USERNAME,
      password: Environemnt.DB_PASSWORD,
      database: Environemnt.DB_NAME,
      autoLoadEntities: true,
      synchronize: true,
    }),
    MessagingWrapperModule,
  ],
})
export class SharedModule {}
