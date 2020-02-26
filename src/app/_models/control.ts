import { User } from "./user";
import { Audit } from "./audit";
import { Attachment } from "./file";
import { Division } from "./division";

export class Control {
  id: string;
  title: string;
  description: string;
  responsible: User;
  responsibleEmployee: User;
  startDate: string;
  frequency: string;
  division: Division;
  date: string;
  exceeded: boolean;
  followUp: boolean;
  remarks: boolean;
  paused: boolean;
  notificationDeadline: number;
  notificationAction: number;

  followingAudits: Audit[];
  completedAudits: Audit[];
  questionnaireIds: QuestionnaireSmall[];

  upcomingAudit: Audit;

  // Optional
  treatmentId: string;
  treatmentName: string;
  riskAssessmentId: string;

  files: Attachment[];

  constructor() {
    this.responsible = new User();
    this.responsibleEmployee = new User();

    this.files = [];
  }
}

export class QuestionnaireSmall {
  title: string;
  id: string;
  active: boolean;
  questionnaireId: string;
  questionnaireSentoutId: string;
}
