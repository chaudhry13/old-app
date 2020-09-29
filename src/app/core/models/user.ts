import { Role } from "./role";
import { Division } from "./division";
import { RiskAssessment } from "./risk-assessment";
import { IncidentReport } from "./incident-report";
import { Treatment } from "./treatment";
import { Control } from "./control";

export class User {
	id: string;
	email: string;
	name: string;
	organization: string;
	role: string;
	phone: string;
	advancedConsequence: boolean;

	riskAssessmentsArea: boolean;
	incidentsArea: boolean;
	healthSafetyArea: boolean;
	auditsArea: boolean;

	riskline: boolean;
	controlrisks: boolean;

	currency: string;
	shortname: string;
	divisions: Division[];

	termsaccepted: boolean;
	external: boolean;
}

export class UserList {
	id: string;
	email: string;
	name: string;
}
