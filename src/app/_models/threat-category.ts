import { ThreatType } from "./threat-type";

export class ThreatCategory {
  id: number;
  name: string;
  threatTypes: ThreatType[];
}
