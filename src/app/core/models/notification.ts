import { NotificationType } from "./notification-type";

export class Notification {
	id: string;
	created: string;
	title: string;
	content: string;
	type: NotificationType;
	read: boolean;
	entityId: string;
}
