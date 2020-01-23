import { GenericService } from "./generic.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Audit } from "../_models/audit";
import { AppConfigService } from './auth-config.service';

@Injectable()
export class AuditService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/audits", appConfigService);
  }

  async get(id: string): Promise<Audit> {
    return this.http.get<Audit>(this.apiBase + "/" + id).toPromise();
  }

  async overdue(id: string, divisions: string[]): Promise<Audit[]> {
    return this.http.post<Audit[]>(this.apiBase + "/overdue?id=" + id, divisions).toPromise();
  }

  async upcoming(id: string): Promise<Audit[]> {
    return this.http.get<Audit[]>(this.apiBase + "/upcoming?id=" + id).toPromise();
  }

  async complete(audit: FormGroup): Promise<boolean> {
    return this.http.post<boolean>(this.apiBase + "/complete", audit.value).toPromise();
  }

  async completed(id: string): Promise<Audit[]> {
    return this.http.get<Audit[]>(this.apiBase + "/completed?id=" + id).toPromise();
  }

  async list(id: string): Promise<Audit[]> {
    return this.http.get<Audit[]>(this.apiBase + "/list/" + id).toPromise();
  }

  async forecast(frequency: string, date: string): Promise<string[]> {
    return this.http.get<string[]>(this.apiBase + "/forecast?frequency=" + frequency + "&date=" + date).toPromise();
  }

  async insert(audit: FormGroup): Promise<string> {
    return this.http.post<string>(this.apiBase, audit).toPromise();
  }

  async update(audit: FormGroup): Promise<string> {
    return this.http.put<string>(this.apiBase, audit).toPromise();
  }

  async delete(id: string): Promise<string> {
    return this.http.delete<string>(this.apiBase + "/" + id).toPromise();
  }
}
