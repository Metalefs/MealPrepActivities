import { Controller, Post, Req, UseInterceptors } from '@nestjs/common';
import { ObjectId } from 'mongodb';
import { AuthInterceptor } from '../../middlewares/auth.interceptor';
import { SubscriptionsService } from './subscriptions.service';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

@Controller('notifications')
@UseInterceptors(AuthInterceptor)
export class SubscriptionsController {
  constructor(private readonly notificationsService: SubscriptionsService) { }

  @Post('/')
  async notification(@Req() request: Request) {
    const userId = new ObjectId((request as any).user);
    const token = (request.body as any).token;
    const date = new Date();
    const subscription = { subscription: ((request.body as any).notification ?? token), userId, type: 'webpush/fcm', token, date};
    await this.notificationsService.register(subscription);
    const payload = JSON.stringify({
      "notification": {
        "title": "Inscrição realizada com sucesso",
        "body": "Notificações configuradas",
        "vibrate": [100, 50, 100],
        "actions": [{
          "action": "explore",
          "title": "Visitar o site"
        }]
      }
    })

    if (token) {
      return this.notificationsService.sendFCMMessage(token, "Inscrição realizada com sucesso", "Notificações configuradas")
    }
    else
      webpush.sendNotification(subscription, payload)
        .catch(error => console.error(error));
  }

  @Post('/fcm')
  async notificationFCM(@Req() request: Request) {
    console.log(request.body);

    const token = (request.body as any).token;
    const userId = new ObjectId((request as any).user);
    const date = new Date();
    const subscription = { subscription: (request.body as any).notification, userId, type: 'fcm', token, date};

    await this.notificationsService.register(subscription);
    return this.notificationsService.sendFCMMessage(token, "Inscrição realizada com sucesso", "Notificações configuradas")
  }
}
