import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import log from './utils/log';
// 打印监听数太多警告堆栈
/* eslint-disable  no-console */
process.on('warning', e => log(e.stack))

// 四舍五入
Number.prototype.roundTo = function (decimalPlaces = 2) {
  const factor = 10 ** decimalPlaces;
  return (Math.round(this * factor) / factor).toString();
};

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('/api');
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({//参数转换
    transform: true,
    whitelist: true,            // 过滤不存在 dto 内的属性
    // forbidNonWhitelisted: true, // 禁止传入不存在 dto 内的属性
    validateCustomDecorators: true,
  }));

  // 文档
  const options = new DocumentBuilder()
    .setTitle('Simi')
    .setDescription('Simi')
    .setVersion('1.0')
    .addSecurity("token", {
      type: 'apiKey',
      name: 'token',
      in: 'header',
      description: "验证令牌"
    })
    .addSecurityRequirements("token")
    .build();

  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api', app, document);

  const port = 6001;

  await app.listen(port, () => {
    log(`http://127.0.0.1:${port}/api`)
  });
}
bootstrap();
