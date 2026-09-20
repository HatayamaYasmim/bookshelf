import { Module } from '@nestjs/common';
import { AccountService } from './account.service';
import { AccountController } from './account.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { MailModule } from 'src/mail/mail.module';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule,
    AuthModule,
    MailModule
  ],
  providers: [AccountService],
  controllers: [AccountController]
})
export class AccountModule {}
