import { TreatmentEffect } from "./treatment-effect";
import { ThreatCategory } from "./threat-category";
import { ThreatType } from "./threat-type";

export class Threat {
  id: string;
  riskAssessmentId: string;
  otherName: string;
  cost: number;
  created: Date;
  updated: Date;
  likelihood: number;
  consequence: number;
  consequenceHuman: number;
  consequenceOperations: number;
  consequenceReputation: number;
  threatLevel: number;
  threatLevelReputation: number;
  threatLevelOperations: number;
  threatLevelHuman: number;
  riskLevel: number;
  riskLevelReputation: number;
  riskLevelOperations: number;
  riskLevelHuman: number;
  residualRiskLevel: number;
  residualRiskLevelHuman: number;
  residualRiskLevelOperations: number;
  residualRiskLevelReputation: number;
  treatmentEffects: TreatmentEffect[];
  implementedTreatmentEffects: TreatmentEffect[];
  notImplementedTreatmentEffects: TreatmentEffect[];
  threatCategory: ThreatCategory;
  threatType: ThreatType;
}

export class ThreatDetails extends Threat {
  comment: string;
  description: string;
}
