import { Division } from "./division";
import { User } from "./user";

export class FollowUp {
  id: string;
  title: string;
  controlId: string;
  remarks: string;
  conclusion: string;
  completed: boolean;
  completedOn: Date;
  createdOn: Date;
  completedByUser: User;
  createdByUser: User;
  responsibleUser: User;
}
