import { User } from "./user";

export class Treatment {
  id: string;
  title: string;
  logoUrl: string;
  cost: number;
  deadline: Date;
  created: Date;
  updated: Date;
  implemented: boolean;
  riskAssessmentId: string;
  responsibleId: string;
  responsible: User;
  controlId: string;
}

export class TreatmentDetails extends Treatment {
  description: string;
}
