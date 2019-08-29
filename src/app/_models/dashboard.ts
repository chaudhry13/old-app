import { Treatment } from "./treatment";
import { Audit } from "./audit";

export class DashboardCostViewModel {
  existingTreatmentCosts: number;
  newTreatmentCosts: number;
  threatCosts: number;
  incidentCosts: number;
  treatmentSavings: number;
}

export class DashboardIncidentReportViewModel {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  source: number;
  incidentCategoryId: number;
}

export class DashboardDeadlinesViewModel {
  exceededTreatments: Treatment[];
  upcomingTreatments: Treatment[];
  exceededAudits: Audit[];
}

export class DashboardRisksViewModel {
  redRisks: number;
  yellowRisks: number;
  greenRisks: number;
  redRisidualRisks: number;
  yellowRisidualRisks: number;
  greenResidualRisks: number;
}

export class DashboardTreatmentViewModel {
  totalTreatments: number;
  totalImplementedTreatments: number;
  totalNotImplementedTreatments: number;
  totalNoDeadlineTreatments: number;
}
