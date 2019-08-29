import { Asset } from "./asset";
import { ThreatType } from "./threat-type";
import { Organization } from "./organization";
import { ThreatCategory } from "./threat-category";

export class ThreatTemplate {
  id: string;
  title: string;
  cost: number;
  description: string;
  comments: string;
  likelihood: number;
  consequence: number;
  consequenceHuman: number;
  consequenceOperations: number;
  consequenceReputation: number;
  shared: boolean;
  siteCategories: number;
  created: Date;
  threatType: ThreatType;
  threatCategory: ThreatCategory;
  organizations: Organization[];
  assets: Asset[];
}
