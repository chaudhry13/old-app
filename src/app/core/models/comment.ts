import { User } from "./user";

export class Comment {
  id: string;
  text: string;
  user: User;
  comments: Comment[];
}

export enum CommentType {
  RiskAssessment,
  IncidentReport,
}
