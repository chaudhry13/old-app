import { Division } from "@app/models/division";
import { IncidentCategory } from "./incident-category";
import { IncidentType } from "./incident-type";
import { Attachment } from "@app/models/file";
import { Country } from "@shared/models/country";
import {
  InjuryType,
  InjuryLocation,
  InjuryPart,
  InvolvedPerson,
} from "./health-safety";
import { User } from "@app/models/user";

export class IncidentReport {
  id: string;
  title: string;
  titleWithoutDate: string;
  description?: string | null;
  other?: string | null;
  logo: string;
  startDate: Date;
  endDate: string;
  created: Date;
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
  user: User; //Reported By

  incidentType: IncidentType;
  incidentCategory: IncidentCategory;

  incidentTypeId: number;
  incidentCategoryId: number;

  injuryLocation: InjuryLocation;
  injuryTypes: InjuryType[];
  injuryParts: InjuryPart[];
  involvedPersons: InvolvedPerson[];

  persons: IncidentReportPersons[];
  vehicles: IncidentReportVehicles[];
  incidentReportUsers: User[];
  customField1: string;
  customField2: string;
  customField3: string;
  customField4: string;
  customField5: string;
  customField6: string;
  customField7: string;

  icon: string;

  constructor() {
    this.files = new Array<Attachment>();
  }
}

export enum IncidentReportFormType {
  Investigation,
  Intelligence,
}

export enum VehicleMakes {
  AlfaRomeo = 1,
  Audi,
  BMW,
  Chevrolet,
  Chrysler,
  Citroen,
  Dacia,
  Daihatsu,
  DS,
  Fiat,
  Ford,
  Honda,
  Hyundai,
  Jaguar,
  Jeep,
  Kia,
  Lancia,
  LandRover,
  Lexus,
  Mazda,
  Mercedes,
  MGRover,
  Mini,
  Mitsubishi,
  Nissan,
  Opel,
  Peugeot,
  Porsche,
  Renault,
  Saab,
  Sachsenring,
  Seat,
  Skoda,
  Smart,
  Subaru,
  Suzuki,
  Toyota,
  Volvo,
  VW,
  Sonstige,
  Unknown = 998,
  Other = 999,
}
export enum VehicleModels {
  Sedan = 5,
  SUV = 10,
  Hatchback = 15,
  Pickup = 20,
  CargoVan = 25,
  RV = 30,
  Truck = 35,
  Wagon = 40,
  Convertible = 45,
  Coupe = 50,
  Supercar = 60,
  Unknown = 998,
  Other = 999,
}
export enum VehicleColor {
  White = 5,
  Black = 10,
  Red = 15,
  Blue = 20,
  Green = 25,
  Yellow = 30,
  Grey = 35,
  Other = 999,
}

export class IncidentReportVehicles {
  id: string;
  incidentReportId: string;
  vrm: string;
  make: VehicleMakes;
  makeOther: string;
  model: VehicleModels;
  modelOther: string;
  color: VehicleColor;
  colorOther: string;
  description: string;
}

export enum Genders {
  "Male",
  "Female",
}
export enum Build {
  "Slim",
  "Proportionate",
  "Overweight",
}

export class IncidentReportPersons {
  name: string;
  email: string;
  gender: Genders;
  approxAge: number;
  height: number;
  build: Build;
  identifyingFeatures: string;
  apparel: string;
  id: string;
  incidentReportId: string;
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

export class PersonsViewModel {
  index: number;
  shown: boolean = true;
}

export class VehiclesViewModel {
  index: number;
  shown: boolean = true;
}
