import { GenericService } from "./generic.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Country } from "../_models/country";

@Injectable()
export class CountryService extends GenericService {
  constructor(private http: HttpClient) {
    super("/countries");
  }

  list(): Observable<Country[]> {
    return this.http.get<Country[]>(this.apiBase + "/list");
  }
}
