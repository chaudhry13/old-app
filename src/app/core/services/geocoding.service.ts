import { GeocodingAddress, GoogleResult } from "../models/location";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { GeocodingResult } from "../models/location";
import { Injectable } from "@angular/core";

@Injectable()
export class GeocodingService {
  public base: string = "https://maps.googleapis.com/maps/api/geocode/json";
  public key: string = "&key=AIzaSyAXqcs7go3XxPZarCGTcSJxm_OU7ClN3Q0";

  constructor(private http: HttpClient) { }

  reverseGeocode(latitude: number, longitude: number): Promise<GoogleResult> {
    return this.http
      .get<GoogleResult>(this.base + `?latlng=${latitude},${longitude}` + this.key, {
        headers: new HttpHeaders().set("Accept", "application/json")
      })
      .toPromise();
  }

  geocode(address: string) {
    return this.http
      .get<GoogleResult>(this.base + "?address=" + address + this.key, {
        headers: new HttpHeaders().set("Accept", "application/json")
      })
      .toPromise();
  }

  geocodeResult(results: GeocodingResult[]): GeocodingAddress {
    var model = new GeocodingAddress();

    var indice = 0;

    if (results.length > 0) {
      for (var j = 0; j < results.length; j++) {
        if (results[j].types[0] == "street_address") {
          indice = j;
          break;
        }
      }
    }

    model.latitude = results[indice].geometry.location.lat;
    model.longitude = results[indice].geometry.location.lng;

    for (var i = 0; i < results[indice].address_components.length; i++) {
      if (results[indice].address_components[i].types[0] == "route") {
        model.street = results[indice].address_components[i].long_name;
      }

      if (results[indice].address_components[i].types[0] == "street_number") {
        model.street_number = results[indice].address_components[i].long_name;
      }

      if (results[indice].address_components[i].types[0] == "locality") {
        model.city = results[indice].address_components[i].long_name;
      }

      if (results[indice].address_components[i].types[0] == "country") {
        model.country = results[indice].address_components[i].short_name;
      }
    }

    return model;
  }
}
