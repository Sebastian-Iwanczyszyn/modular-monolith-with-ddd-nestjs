import { Module } from '@nestjs/common';
import { SharedModule } from './shared.module';
import { HttpAppModule } from './ui/http/http-app.module';
import { WsAppModule } from './ui/ws/ws-app.module';

@Module({
  imports: [
    HttpAppModule,
    WsAppModule,
    SharedModule,
  ],
})
export class AppModule {
}
