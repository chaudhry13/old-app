import { GenericService } from "@app/services/generic.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import {
  Audit,
  AuditFilter,
  QuestionnaireUserAnswerAudit,
} from "../models/audit";
import { AppConfigService } from "@app/services/app-config.service";

@Injectable()
export class AuditService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/audits", appConfigService);
  }

  async get(id: string): Promise<Audit> {
    return this.http.get<Audit>(this.apiBase + "/" + id).toPromise();
  }

  async overdue(id: string, divisions: string[]): Promise<Audit[]> {
    return this.http
      .post<Audit[]>(this.apiBase + "/overdue?id=" + id, divisions)
      .toPromise();
  }

  async upcoming(id: string): Promise<Audit[]> {
    return this.http
      .get<Audit[]>(this.apiBase + "/upcoming?id=" + id)
      .toPromise();
  }

  async complete(audit: FormGroup): Promise<boolean> {
    return this.http
      .post<boolean>(this.apiBase + "/complete", audit.value)
      .toPromise();
  }

  async completed(id: string): Promise<Audit[]> {
    return this.http
      .get<Audit[]>(this.apiBase + "/completed?id=" + id)
      .toPromise();
  }

  async list(filter: AuditFilter): Promise<Audit[]> {
    return this.http.post<Audit[]>(this.apiBase + "/list", filter).toPromise();
  }

  async postList(data: any): Promise<Audit[]> {
    return this.http.post<Audit[]>(this.apiBase + "/list", data).toPromise();
  }

  async forecast(frequency: string, date: string): Promise<string[]> {
    return this.http
      .get<string[]>(
        this.apiBase + "/forecast?frequency=" + frequency + "&date=" + date
      )
      .toPromise();
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

  async sendTo(data: FormGroup): Promise<any> {
    return this.http.post(this.apiBase + "/sendTo", data.value).toPromise();
  }

  async canFinishAudit(id: string): Promise<boolean> {
    return this.http
      .get<boolean>(this.apiBase + "/CanFinishAudit/" + id)
      .toPromise();
  }

  async generateUserAnswers(
    auditId: string
  ): Promise<QuestionnaireUserAnswerAudit[]> {
    return this.http
      .post<QuestionnaireUserAnswerAudit[]>(
        this.apiBase + "/InsertUserAnswers?id=" + auditId,
        null
      )
      .toPromise();
  }
}
