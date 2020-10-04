import { GenericService } from "@app/services/generic.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Country } from "@shared/models/country";
import { AppConfigService } from "@app/services/auth-config.service";

@Injectable()
export class CountryService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/countries", appConfigService);
  }

  list(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiBase + "/list");
  }
}
