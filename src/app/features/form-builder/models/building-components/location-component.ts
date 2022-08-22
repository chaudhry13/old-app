import { BuildingComponent, BuildingComponentType } from './building-component';

export class LocationBuildingComponent extends BuildingComponent {
  locationOptions: LocationOptions;

  constructor() {
    super();
    this.type = BuildingComponentType.Location;
    this.locationOptions = {
      longitude: null,
      latitude: null,
      city: null,
      countryId: null,
      address: null,
    };
  }
}

export interface LocationOptions {
  longitude: number;
  latitude: number;
  city: string;
  countryId: string;
  address: string;
}
