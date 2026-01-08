import { Notification } from "src/database/prisma-client/client";

export type NotificationDto = Pick<Notification,'userId' | 'type' | 'title' | 'message' | 'data'>;
