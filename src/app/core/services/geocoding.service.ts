import { GeocodingAddress, GoogleResult } from "../models/location";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { GeocodingResult } from "../models/location";
import { Injectable } from "@angular/core";
import { AppConfigService } from "./app-config.service";
import { OrgConfig } from "@app/interfaces/org-config";

@Injectable()
export class GeocodingService {
  public base: string = "https://maps.googleapis.com/maps/api/geocode/json";

  constructor(private http: HttpClient, private config: AppConfigService) {}

  reverseGeocode(latitude: number, longitude: number): Promise<GoogleResult> {
    const apiKey = this.config.orgConfig.googleApiKey;

    const key = `&key=${apiKey}`;
    return this.http
      .get<GoogleResult>(this.base + `?latlng=${latitude},${longitude}` + key, {
        headers: new HttpHeaders().set("Accept", "application/json"),
      })
      .toPromise();
  }

  geocode(address: string) {
    const apiKey = this.config.orgConfig.googleApiKey;

    const key = `&key=${apiKey}`;

    return this.http
      .get<GoogleResult>(this.base + "?address=" + address + key, {
        headers: new HttpHeaders().set("Accept", "application/json"),
      })
      .toPromise();
  }

  geocodeResult(results: GeocodingResult[]): GeocodingAddress {
    var model = new GeocodingAddress();

    var resultDict: {key: string, shortName: string, longName: string}[] = results.reduce((res, current) => {
      current.address_components.forEach((type) => {
        if (!res.some(x => x.key === type.types[0])) {
          res.push({ key: type.types[0], shortName: type.short_name, longName: type.long_name });
        }
      });
      return res;
    }, []);
    
    var geoRes = results.findIndex(r => r.geometry?.location?.lat && r.geometry?.location?.lng);

    model.latitude = results[geoRes].geometry.location.lat;
    model.longitude = results[geoRes].geometry.location.lng;

    if (resultDict.some(r => r.key == "route")) {
      model.street = resultDict.find(r => r.key == "route").longName;
    }
    if (resultDict.some(r => r.key == "street_number")) {
      model.street_number = resultDict.find(r => r.key == "street_number").longName;
    }
    if (resultDict.some(r => r.key == "locality")) {
      model.city = resultDict.find(r => r.key == "locality").longName;
    }
    if (resultDict.some(r => r.key == "country")) {
      model.country = resultDict.find(r => r.key == "country").shortName;
    }

    return model;
  }
}
