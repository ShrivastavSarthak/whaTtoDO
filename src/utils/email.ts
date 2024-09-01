import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { EmailOptions } from 'src/type';

@Injectable()
export class EmailService {
  constructor(private readonly mailerService: MailerService) {}
  async sendMail(emailOptions: EmailOptions) {
    console.log(emailOptions);

    try {
      await this.mailerService.sendMail({
        from: 'Email verification <sharthakshrivastav20112002@gmail.com>',
        to: emailOptions.to,
        subject: emailOptions.subject,
        text: emailOptions.body,
      });
    } catch (error) {
      console.log(error);
    }
  }
}
