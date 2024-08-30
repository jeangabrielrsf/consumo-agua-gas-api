import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/user.entity';
import { Measure } from './measures/measures.entity';
import { DataSource } from 'typeorm';
import { MeasuresModule } from './measures/measures.module';
import { UserModule } from './users/users.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GeminiService } from './gemini/gemini.service';
import { createGenAIClient } from './gemini/gemini.configuration';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    TypeOrmModule.forRoot({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: `${process.env.DB_USER}`,
        password: `${process.env.DB_PASSWORD}`,
        database: 'consumo_api',
        entities: [User, Measure],
        synchronize: true
      }), 
    MeasuresModule, 
    UserModule,

  ],
  controllers: [AppController],
  providers: [AppService,
    GeminiService,
    {
    provide: 'GENAI_CLIENT',
    useFactory: createGenAIClient,
    inject: [ConfigService]
  }],
})
export class AppModule {
  constructor(private dataSource: DataSource) {}
}
