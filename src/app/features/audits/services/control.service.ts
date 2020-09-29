import { GenericService } from "@app/services/generic.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Audit } from "@app/models/audit";
import { Control } from "@app/models/control";
import { AppConfigService } from "@app/services/auth-config.service";

@Injectable()
export class ControlService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/controls", appConfigService);
  }

  async get(id: string): Promise<Control> {
    return this.http.get<Control>(this.apiBase + "/" + id).toPromise();
  }

  async list(filter: FormGroup): Promise<Control[]> {
    return this.http.post<Control[]>(this.apiBase + "/list/", filter).toPromise();
  }

  async insert(control: FormGroup): Promise<string> {
    return this.http.post<string>(this.apiBase, control).toPromise();
  }

  async update(control: FormGroup): Promise<boolean> {
    return this.http.put<boolean>(this.apiBase, control).toPromise();
  }

  async delete(id: string): Promise<boolean> {
    return this.http.delete<boolean>(this.apiBase + "/" + id).toPromise();
  }

  async pause(id: string): Promise<boolean> {
    return this.http.get<boolean>(this.apiBase + "/pause/" + id).toPromise();
  }

  async resume(id: string, date: string): Promise<boolean> {
    return this.http.get<boolean>(this.apiBase + "/pause/" + id + "?resumeDate=" + date).toPromise();
  }

  async frequency(control: FormGroup): Promise<boolean> {
    return this.http.post<boolean>(this.apiBase + "/frequency", control).toPromise();
  }
}
