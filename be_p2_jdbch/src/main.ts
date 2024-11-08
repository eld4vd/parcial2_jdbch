/*en el main.ts se configura la aplicación de NestJS, se habilita el uso de pipes para la validación de datos, 
se habilita el uso de CORS y se configura la documentación de Swagger.*/
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe()); //se habilita el uso de pipes para la validación de datos

  app.setGlobalPrefix('api'); //se establece un prefijo global para las rutas de la API
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.enableCors();

  const config = new DocumentBuilder() //se configura la documentación de Swagger
    .setTitle('Api Rest Serie - 2do Parcial SIS-257') //se establece el título de la documentación vista en la página principal
    //se establece la descripción de la documentación vista en la página principal
    .setDescription(
      'Api Rest de la materia Desarrollo de Aplicaciones Int/Internet II - Segundo Parcial',
    )
    .setVersion('1.0')
    .addTag('serie') //se añade una etiqueta a la documentación
    .build();
  const document = SwaggerModule.createDocument(app, config); //se crea el documento de Swagger
  SwaggerModule.setup('apidoc', app, document); //aqui se establece la ruta de la documentación con el prefijo /apidoc

  await app.listen(process.env.PORT); //se inicia la aplicación en el puerto 3000
  console.log(`App corriendo: ${await app.getUrl()}/apidoc`); //se imprime en consola la URL, es decir en el comando de consola despues de hacer npm run start:dev
}
bootstrap();
