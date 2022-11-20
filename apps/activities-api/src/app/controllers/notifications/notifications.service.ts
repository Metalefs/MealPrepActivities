import { Inject, Injectable } from '@nestjs/common';
import { Db } from 'mongodb';
import { BaseService } from '../../services/base.service';
import { getMessaging, Message } from 'firebase-admin/messaging';

@Injectable()
export class NotificationsService extends BaseService {
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    super(db, "notifications");
  }
  async register(subscription) {
    console.log(subscription)
    if (subscription.endpoint){
      await this.insert(subscription, false)
    }
    console.log(`Subscription received`);
    const payload = JSON.stringify({
      "notification": {
        "title": "PWA-PUSH-ANGULAR",
        "body": "Uma nova notificação chegou!!",
        "vibrate": [100, 50, 100],
        "data": {
          "dateOfArrival": "2018-08-31",
          "primaryKey": 1
        },
        "actions": [{
          "action": "explore",
          "title": "Go to the site"
        }]
      }
    })
    return payload;
  }

  async sendFCMMessage(fcmToken: string, msg: Message): Promise<string> {
    try {
      const res = await getMessaging().send({
        webpush: {
          notification: {
            ...msg,
            requireInteraction: msg.webpush.notification.requireInteraction ?? false,
            actions: [{
              title: 'Open',
              action: 'open',
            }],
            data: {

            },
          },
        },
        token: fcmToken,
      });
      return res;
    } catch (e) {
      console.error('sendFCMMessage error', e);
    }
  }
}
