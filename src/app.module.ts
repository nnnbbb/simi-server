import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CommonModule } from './common/common.module';
import { BusinessExceptionFilter } from './common/filters/business-exception.filter';
import { AuthGuard } from './common/guard/auth.guard';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import databaseConfig from './config/database.config';
import { RecordModule } from './record/record.module';
import { SentenceModule } from './sentence/sentence.module';
import { SuggestModule } from './suggest/suggest.module';
import { WordModule } from './word/word.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: [".env"],
      load: [databaseConfig],
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (config: ConfigService) => config.get('database'),
      inject: [ConfigService],
    }),
    MulterModule.registerAsync({
      imports: [],
      useFactory: async () => ({
        dest: process.env.RESOURCES_SRC,
      }),
      inject: [ConfigService],
    }),
    CommonModule,
    SuggestModule,
    WordModule,
    SentenceModule,
    RecordModule,
  ],
  controllers: [
    AppController
  ],
  providers: [
    AppService,
    {
      // 转换响应格式
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
    {
      // 捕获业务异常
      provide: APP_FILTER,
      useClass: BusinessExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer
  //     .apply(LoggerMiddleware)
  //     .forRoutes("*");
  // }
}
