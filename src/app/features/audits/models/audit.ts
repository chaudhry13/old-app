import { Attachment } from "./file";
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

  questionnaire: boolean;
  questionnaireUserAnswers: Array<QuestionnaireUserAnswerAudit>;

  constructor() {
    this.files = new Array<Attachment>();
  }
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
