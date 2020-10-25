import { GenericService } from "@app/services/generic.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import {
  InjuryPart,
  InjuryType,
  InjuryLocation,
  InvolvedPerson,
} from "../models/health-safety";
import { AppConfigService } from "@app/services/auth-config.service";

@Injectable()
export class HealthSafetyService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/health-safety", appConfigService);
  }

  injuryParts(): Promise<InjuryPart[]> {
    return this.http
      .get<InjuryPart[]>(this.apiBase + "/injury-parts")
      .toPromise();
  }

  injuryTypes(): Promise<InjuryType[]> {
    return this.http
      .get<InjuryType[]>(this.apiBase + "/injury-types")
      .toPromise();
  }

  injuryLocations(): Promise<InjuryLocation[]> {
    return this.http
      .get<InjuryLocation[]>(this.apiBase + "/injury-locations")
      .toPromise();
  }

  involvedPersons(): Promise<InvolvedPerson[]> {
    return this.http
      .get<InvolvedPerson[]>(this.apiBase + "/involved-persons")
      .toPromise();
  }
}
