import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GenericService } from "./generic.service";
import { IncidentCategory } from "../_models/incident-category";
import { FormGroup } from "@angular/forms";

@Injectable()
export class IncidentCategoryService extends GenericService {
  constructor(private http: HttpClient) {
    super("/incident-categories");
  }

  async create(filter: FormGroup): Promise<string> {
    return this.http.post<string>(this.apiBase, filter).toPromise();
  }

  async list(incidentTypes: boolean): Promise<IncidentCategory[]> {
    return this.http.get<IncidentCategory[]>(this.apiBase + "/list?includeIncidentTypes=" + incidentTypes).toPromise();
  }

  async update(filter: FormGroup): Promise<string> {
    return this.http.put<string>(this.apiBase, filter).toPromise();
  }
}
