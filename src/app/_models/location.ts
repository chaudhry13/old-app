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