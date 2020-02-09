import { Division } from "./division";
import { IncidentCategory } from "./incident-category";
import { IncidentType } from "./incident-type";
import { Attachment } from "./file";
import { Country } from "./country";
import { InjuryType, InjuryLocation, InjuryPart, InvolvedPerson } from "./health-safety";
import { User } from './user';

export class IncidentReport {
	id: string;
	title: string;
	description?: string | null;
	other?: string | null;
	logo: string;
	startDate: string;
	endDate: string;
	source: number;
	address: string;
	city: string;
	country: Country;
	latitude?: number | null;
	longitude?: number | null;
	nearMiss: boolean;
	lossValue: number;
	riskLevel: number;
	personsInjured: number;
	files: Attachment[];
	divisions: Division[];
	user: User[];

	incidentType: IncidentType;
	incidentCategory: IncidentCategory;

	incidentTypeId: number;
	incidentCategoryId: number;

	injuryLocation: InjuryLocation;
	injuryTypes: InjuryType[];
	injuryParts: InjuryPart[];
	involvedPersons: InvolvedPerson[];

	icon: string;

	constructor() {
		this.files = new Array<Attachment>();
	}
}
