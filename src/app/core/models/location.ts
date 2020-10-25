export class GoogleResult {
  results: GeocodingResult[];
  status: string;
}

export class GeocodingResult {
  address_components: AddressComponent[];
  formatted_address: string;
  geometry: Geometry;
  types: string[];
}

export class AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

export class Geometry {
  location: Location;
  location_type: string;
}

export class Location {
  lat: number;
  lng: number;
}

export class GeocodingAddress {
  street_number: string;
  street: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}

export class LocationViewModel {
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;

  constructor(model: GeocodingAddress) {
    this.address = model.street
      ? model.street + (model.street_number ? " " + model.street_number : "")
      : "No Address Found";
    this.city = model.city ? model.city : "No City Found";
    this.country = model.country ? model.country : "No Country Found";
    this.latitude = model.latitude;
    this.longitude = model.longitude;
  }
}
