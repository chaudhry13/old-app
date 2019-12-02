import { Injectable, ElementRef } from "@angular/core";

declare var google;

@Injectable()
export class MapService {
	map: any;

	constructor() {}

	init(latitude: number, longitude: number, element: ElementRef, marker?: boolean) {
		let position = new google.maps.LatLng(latitude, longitude);

		let options = {
			center: position,
			zoom: 14,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			streetViewControl: false,
			scrollwheel: false
		};

		this.map = new google.maps.Map(element.nativeElement, options);

		this.map.setCenter(position);

		if (marker) {
			this.marker(latitude, longitude);
		}
	}

	center(latitude: number, longitude: number) {
		let position = new google.maps.LatLng(latitude, longitude);

		this.map.setCenter(position);
	}

	marker(latitude: number, longitude: number) {
		let position = new google.maps.LatLng(latitude, longitude);

		var marker = new google.maps.Marker({
			position: position,
			map: this.map
		});
	}
}