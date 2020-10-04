import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { GenericService } from "./generic.service";
import { IncidentCategory, IncidentCategoryMappingTable } from "../models/incident-category";
import { FormGroup } from "@angular/forms";
import { AppConfigService } from './auth-config.service';
import { IncidentType } from '../models/incident-type';

@Injectable()
export class IncidentCategoryService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/incident-categories", appConfigService);
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

  async getMappings(): Promise<IncidentCategoryMappingTable> {
    return this.http.get<IncidentCategoryMappingTable>(this.apiBase + "/Mapping").toPromise();
  }

  public compareIncidentTypes(a: IncidentType, b: IncidentType): number {
    if (a.name.includes("Other")) {
      return 1;
    } else if (b.name.includes("Other")) {
      return -1;
    }
    return (a.name > b.name ? 1 : -1);
  }

  public listIncidentTypes(incidentCategories: IncidentCategory[]): IncidentType[] {
    var incidentTypes: IncidentType[] = [];
    incidentCategories.forEach(cat => incidentTypes = cat.incidentTypes.concat(incidentTypes));
    incidentTypes.sort(this.compareIncidentTypes);
    return incidentTypes;
  }

  public getIncidentCategoryFrom(incidentType: IncidentType, incidentCategories: IncidentCategory[]): IncidentCategory {
    return incidentCategories.find(cat => cat.incidentTypes.includes(incidentType));
  }
}
