import { Injectable, Logger } from '@nestjs/common';

export enum NotificationType {
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
  ERROR = 'error',
}

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);

  notify(
    organizationId: string,
    userId: string,
    data: {
      type: NotificationType;
      title: string;
      message: string;
      link?: string;
    },
  ) {
    // In a real app, this would:
    // 1. Save to a notifications table
    // 2. Emit a socket.io event
    // 3. Send a push notification if needed

    this.logger.log(
      `[Notification] ${data.type.toUpperCase()} for User ${userId}: ${data.title} - ${data.message}`,
    );

    return {
      success: true,
      timestamp: new Date(),
    };
  }

  notifyOrg(
    organizationId: string,
    data: {
      type: NotificationType;
      title: string;
      message: string;
    },
  ) {
    this.logger.log(
      `[Org Notification] ${data.type.toUpperCase()} for Org ${organizationId}: ${data.title}`,
    );
  }
}
