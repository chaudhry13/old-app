import { Attachment } from "@app/models/file";
import { User } from "@app/models/user";
import { QuestionAnsweredStatus } from "./questionnaire";

export class Audit {
  id: string;
  controlId: string;
  title: string;
  description: string;
  date: string;
  remarks?: string;
  other?: string;
  followUp: boolean;
  followUpId: string;
  late: boolean;
  completed: boolean;
  completedAt: Date;
  completedById: string;
  location: boolean;
  latitude: number;
  longitude: number;
  files: Attachment[];
  flow: UserFlow[];
  subjectForReview: boolean;
  status: number;
  currentId:string;
  current:User

  questionnaire: boolean;
  questionnaireUserAnswers: Array<QuestionnaireUserAnswerAudit>;

  constructor() {
    this.files = new Array<Attachment>();
  }
}

interface UserFlow {
  id: string;
  email: string;
  deleted: boolean;
  lastLogin: any;
  name: string;
  organizationId: string;
  phone: string;
  role: string;
  termsAccepted: boolean;
}

export class QuestionnaireUserAnswerAudit {
  id: string;
  status: QuestionAnsweredStatus;
  userId: string;
  auditId: string;
  questionnaireId: string;
  questionsAnswered: number;
  numberOfQuestions: number;
  questionnaireTitle: string;
}
