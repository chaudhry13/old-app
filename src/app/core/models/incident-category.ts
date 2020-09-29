import { IncidentType } from "./incident-type";

export class IncidentCategory {
  id: number;
  name: string;
  incidentTypes: IncidentType[];
}

export class IncidentCategoryMappingTable {
	mappings: IncidentCategoryMapping[];
}

export class IncidentCategoryMapping {
	incidentCategoryId: number;
	form: string;
	default: boolean;
}