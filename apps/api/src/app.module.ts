import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { CrmModule } from './modules/crm/crm.module';
import { DocumentsModule } from './modules/documents/documents.module';
import { NotificationsModule } from './common/notifications/notifications.module';
import { SchedulingModule } from './modules/scheduling/scheduling.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { AutomationModule } from './modules/automation/automation.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { HealthModule } from './modules/health/health.module';
import { ClientPortalModule } from './modules/client-portal/client-portal.module';
import { DummyDataSeeder } from './common/seed/dummy-data.seeder';
import { User } from './modules/auth/entities/user.entity';
import { Organization } from './modules/tenant/entities/organization.entity';
import { OrganizationMember } from './modules/tenant/entities/organization-member.entity';
import { Contact } from './modules/crm/entities/contact.entity';
import { BookingType } from './modules/scheduling/entities/booking-type.entity';
import { Automation } from './modules/automation/entities/automation.entity';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { TenantInterceptor } from './common/interceptors/tenant.interceptor';

@Module({
  imports: [
    // Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const useDummy = configService.get('USE_DUMMY_DATA') === 'true';

        if (useDummy) {
          return {
            type: 'sqlite',
            database: 'dev.sqlite',
            entities: [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize: true,
            logging: true,
          };
        }

        return {
          type: 'postgres',
          host: configService.get('DATABASE_HOST'),
          port: configService.get<number>('DATABASE_PORT'),
          username: configService.get('DATABASE_USER'),
          password: configService.get('DATABASE_PASSWORD'),
          database: configService.get('DATABASE_NAME'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('NODE_ENV') === 'development',
          logging: configService.get('NODE_ENV') === 'development',
        };
      },
    }),

    // Feature modules
    AuthModule,
    CrmModule,
    DocumentsModule,
    NotificationsModule,
    SchedulingModule,
    PaymentsModule,
    AutomationModule,
    AnalyticsModule,
    HealthModule,
    TypeOrmModule.forFeature([
      User,
      Organization,
      OrganizationMember,
      Contact,
      BookingType,
      Automation,
    ]),
    ClientPortalModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    DummyDataSeeder,
    {
      provide: APP_INTERCEPTOR,
      useClass: TenantInterceptor,
    },
  ],
})
export class AppModule { }
