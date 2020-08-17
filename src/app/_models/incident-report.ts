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
	created: string;
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
	user: User;

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

export enum IncidentReportFormType {
	Investigation,
	Intelligence
}

export enum VehicleMakes {
	AlfaRomeo = 1, Audi, BMW, Chevrolet, Chrysler, Citroen, Dacia, Daihatsu, DS, Fiat, Ford, Honda, Hyundai, Jaguar, Jeep, Kia, Lancia, LandRover, Lexus, Mazda, Mercedes, MGRover, Mini, Mitsubishi, Nissan, Opel, Peugeot, Porsche, Renault, Saab, Sachsenring, Seat, Skoda, Smart, Subaru, Suzuki, Toyota, Volvo, VW, Sonstige, Unknown = 998, Other = 999
}
export enum VehicleModels {
	Sedan = 5, SUV = 10, Hatchback = 15, Pickup = 20, CargoVan = 25, RV = 30, Truck = 35, Wagon = 40, Convertible = 45, Coupe = 50, Supercar = 60, Unknown = 998, Other = 999
}
export enum VehicleColor {
	White = 5, Black = 10, Red = 15, Blue = 20, Green = 25, Yellow = 30, Grey = 35, Other = 999
}

export class IncidentReportVehicles {
	Id: string;
	IncidentReportId: string;
	VRM: string;
	Make: VehicleMakes;
	MakeOther: string;
	Model: VehicleModels;
	ModelOther: string;
	Color: VehicleColor;
	ColorOther: string;
	Description: string;
}

export enum Genders {
	"Male",
	"Female"
}
export enum Build {
	"Slim",
	"Proportionate",
	"Overweight"
}
export class PersonIntelligenceReport {
	firstName: string;
	lastName: string;
	gender: Genders;
	approxAge: number;
	height: number;
	build: Build;
	identifyingfeatures: string;
	clothes: string;
}
