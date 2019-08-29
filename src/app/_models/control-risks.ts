export class ControlRisksCountry {
  id: string;
  name: string;
  political: string;
  security: string;
  operational: string;
  terror: string;
  travel: string;
  isLinked: string;
  isoCode: string;
  travelAdvisory: string;
  url: string;
  politicalDefinition: string;
  securityDefinition: string;
  operationalDefinition: string;
  terrorDefinition: string;
  travelDefinition: string;
  zones: ControlRisksCountryZone[];
}

export class ControlRisksCountryZone {
  id: string;
  name: string;
  political: string;
  security: string;
  operational: string;
  terror: string;
  travel: string;
  politicalDefinition: string;
  securityDefinition: string;
  operationalDefinition: string;
  terrorDefinition: string;
  travelDefinition: string;
}

export class ControlRisksCountrySummary {
  id: string;
  modified: Date;
  description: string;
  countryCode: string;
  url: string;
  type: string;
}
