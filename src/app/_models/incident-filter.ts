import { IncidentCategory } from "./incident-category";

export class IncidentFilter {
  id: string;
  startDate: Date;
  endDate: Date;
  range: number;
  riskLevels: string[];
  external: boolean;
  internal: boolean;
  subscribe: boolean;
  riskAssessmentId: string;
  incidentCategories: IncidentCategory[];
}
