require('dotenv').config()
import { Db, ObjectId } from 'mongodb';
import { Inject, Injectable } from '@nestjs/common';
import { SubscriptionRepository } from '../repository/subscription.repository';
import { messaging } from "firebase-admin";
import { TokenMessage } from 'firebase-admin/messaging';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const webpush = require('web-push');

@Injectable()
export class SubscriptionService {

  repo: SubscriptionRepository;
  constructor(@Inject('DATABASE_CONNECTION') protected db: Db) {
    this.repo = new SubscriptionRepository(db)
  }

  getUserSubscription(userId) {
    return this.repo.find({ userId: new ObjectId(userId) })
  }

  async sendNotification(subscription, notification) {
    return webpush.sendNotification(subscription, notification)
      .catch(error => console.error(error));
  }

  async sendFCMNotification(subscription, notification) {
    const message:TokenMessage = {
      "token": subscription.token,
      "notification": {
        "body": notification.title,
        "title": notification.title
      }
    };

    await messaging().send(message)
      .then((response) => {
        // Response is a message ID string.
        console.log('Successfully sent message:', response);
      })
      .catch((error) => {
        console.log('Error sending message:', error);
      });
  }
};