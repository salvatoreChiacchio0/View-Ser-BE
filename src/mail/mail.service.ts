import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
 
@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(user: CreateUserDto, token: string) {
    const url = `localhost/auth/confirm?token=${token}`;

    await this.mailerService.sendMail({
        to: user.email,
        subject: 'Welcome to Nice App! Confirm your Email',      
        template: './confirmation',  
        context: { 
          name: user.name,
          url,
        },
      })
      .then((r) => {
        console.log(r, '\n\nemail is sent\n\n');
      })
      .catch((e) => {
        console.log(e, 'error sending email');
      });;
      
  }
}
