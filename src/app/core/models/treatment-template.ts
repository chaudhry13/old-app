import { ThreatType } from "./threat-type";
import { Asset } from "./asset";

export class TreatmentTemplate {
  id: string;
  title: string;
  cost: number;
  description: string;
  siteCategories: number;
  threatTypes: ThreatType[];
  assets: Asset[];
  shared: boolean;
  created: Date;
}
