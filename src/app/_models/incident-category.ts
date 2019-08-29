import { IncidentType } from "./incident-type";

export class IncidentCategory {
  id: number;
  name: string;
  incidentTypes: IncidentType[];
}
