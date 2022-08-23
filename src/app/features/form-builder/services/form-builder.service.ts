import { Injectable } from '@angular/core';
import {GenericService} from "@app/services/generic.service";
import {HttpClient} from "@angular/common/http";
import {AppConfigService} from "@app/services/app-config.service";
import {Observable} from "rxjs";
import {FormListItem} from "../models/form-list-item";
import {FormDto} from "../models/form.dto";

@Injectable({
  providedIn: 'root',
})
export class FormBuilderService extends GenericService {
  constructor(private http: HttpClient, public appConfigService: AppConfigService) {
    super('/HrForm', appConfigService);
  }

  listAllTemplates(): Observable<FormListItem[]> {
    return this.http.get<FormListItem[]>(this.apiBase + '/listAllTemplates');
  }

  get(id: string): Observable<FormDto> {
    return this.http.get<FormDto>(this.apiBase + '/' + id);
  }

  create(form: FormDto): Observable<string> {
    return this.http.post<string>(this.apiBase, form);
  }

  update(id:string, form: FormDto): Observable<string> {
    return this.http.put<string>(this.apiBase + `/upsert/${id}`, form);
  }

  delete(id: string): Observable<string> {
    return this.http.delete<string>(this.apiBase + '/' + id);
  }

  createFormInstance(form: FormDto): Observable<string> {
    return this.http.post<string>(this.apiBase + '/createFormInstance', form);
  }

  listCustomInstances(divisionIds: string[]): Observable<FormListItem[]> {
    return this.http.post<FormListItem[]>(this.apiBase + '/listCustomInstances', divisionIds );
  }

  listCustomTemplates(): Observable<FormListItem[]> {
    return this.http.get<FormListItem[]>(this.apiBase + '/listCustomTemplates');
  }

  getOrgIncidentTemplate(): Observable<FormDto> {
    return this.http.get<FormDto>(this.apiBase + '/getOrgIncidentTemplate');
  }

  getOrgActivityTemplate(): Observable<FormDto> {
    return this.http.get<FormDto>(this.apiBase + '/getOrgActivityTemplate');
  }
}
