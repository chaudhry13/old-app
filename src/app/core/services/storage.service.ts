import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { HttpClient } from "@angular/common/http";
import { Attachment } from "../models/file";
import { AppConfigService } from "./auth-config.service";

@Injectable()
export class StorageService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/storage", appConfigService);
  }

  /// List endpoints

  async listRiskAssessment(id: string): Promise<Attachment[]> {
    return this.http
      .get<Attachment[]>(
        this.apiBase + "/risk-assessment?riskAssessmentId=" + id
      )
      .toPromise();
  }

  async listTemplate(id: string): Promise<Attachment[]> {
    return this.http
      .get<Attachment[]>(this.apiBase + "/template?templateId=" + id)
      .toPromise();
  }

  async listTreatment(
    riskAssessmentId: string,
    treatmentId: string
  ): Promise<Attachment[]> {
    return this.http
      .get<Attachment[]>(
        this.apiBase +
          "/treatment?riskAssessmentId=" +
          riskAssessmentId +
          "&treatmentId=" +
          treatmentId
      )
      .toPromise();
  }

  async listIncidentReport(id: string): Promise<Attachment[]> {
    return this.http
      .get<Attachment[]>(
        this.apiBase + "/incident-report?incidentReportId=" + id
      )
      .toPromise();
  }

  async listActivityFiles(activityId: string): Promise<Attachment[]> {
    return this.http.get<Attachment[]>(this.apiBase + "/activity-log/activity?activityId=" + activityId).toPromise();
  }

  async listControl(id: string): Promise<Attachment[]> {
    return this.http
      .get<Attachment[]>(this.apiBase + "/control?controlId=" + id)
      .toPromise();
  }

  async listAudit(controlId: string, auditId: string): Promise<Attachment[]> {
    return this.http
      .get<Attachment[]>(
        this.apiBase + "/audit?controlId=" + controlId + "&auditId=" + auditId
      )
      .toPromise();
  }

  /// Delete endpoints
  async deleteRiskAssessment(id: string, fileName: string): Promise<any> {
    return this.http
      .delete<any>(
        this.apiBase +
          "/risk-assessment?riskAssessmentId=" +
          id +
          "&fileName=" +
          fileName
      )
      .toPromise();
  }

  async deleteIncidentReport(id: string, fileName: string): Promise<any> {
    return this.http
      .delete<any>(
        this.apiBase +
          "/incident-report?incidentReportId=" +
          id +
          "&fileName=" +
          fileName
      )
      .toPromise();
  }

  async deleteTemplate(id: string, fileName: string): Promise<any> {
    return this.http
      .delete<any>(
        this.apiBase + "/template?templateId=" + id + "&fileName=" + fileName
      )
      .toPromise();
  }

  async deleteTreatment(
    id: string,
    treatmentId: string,
    fileName: string
  ): Promise<any> {
    return this.http
      .delete<any>(
        this.apiBase +
          "/treatment?riskAssessmentId=" +
          id +
          "&treatmentId=" +
          treatmentId +
          "&fileName=" +
          fileName
      )
      .toPromise();
  }

  async deleteControl(id: string, fileName: string): Promise<any> {
    return this.http
      .delete<any>(
        this.apiBase + "/control?controlId=" + id + "&fileName=" + fileName
      )
      .toPromise();
  }

  async deleteAudit(
    id: string,
    auditId: string,
    fileName: string
  ): Promise<any> {
    return this.http
      .delete<any>(
        this.apiBase +
          "/audit?controlId=" +
          id +
          "&auditId=" +
          auditId +
          "&fileName=" +
          fileName
      )
      .toPromise();
  }

  async listQuestionnaire(
    questionnaireId: string,
    sentOutId: string,
    questionnaireUserAnswerId: string,
    questionAnswerId: string
  ): Promise<Attachment[]> {
    var url = "/questionnaire?questionnaireId=" + questionnaireId;
    if (sentOutId) {
      url += "&sentOutId=" + sentOutId;
    }
    if (questionnaireUserAnswerId) {
      url += "&questionnaireUserAnswerId=" + questionnaireUserAnswerId;
    }
    if (questionAnswerId) {
      url += "&questionAnswerId=" + questionAnswerId;
    }
    return this.http.get<Attachment[]>(this.apiBase + url).toPromise();
  }
  async deleteQuestionnaire(
    questionnaireId: string,
    sentOutId: string,
    questionnaireUserAnswerId: string,
    questionAnswerId: string,
    fileName: string
  ): Promise<any> {
    var url =
      "/questionnaire?questionnaireId=" +
      questionnaireId +
      "&sentOutId=" +
      sentOutId +
      "&questionnaireUserAnswerId=" +
      questionnaireUserAnswerId +
      "&questionAnswerId=" +
      questionAnswerId +
      "&fileName=" +
      fileName;
    return this.http.delete<any>(this.apiBase + url).toPromise();
  }


  async deleteActivityFile(activityId: string, fileName: string): Promise<any> {
    var url = "/activity-log/activity?activityId=" + activityId + "&fileName=" + fileName;
    return this.http.delete<any>(this.apiBase + url).toPromise();
  }
}
