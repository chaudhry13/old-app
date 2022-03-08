import { GenericService } from "@app/services/generic.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IncidentReport } from "../../features/incident-reports/models/incident-report";
import { FormGroup } from "@angular/forms";
import {
  PaginationResult,
  Pagination,
} from "../../features/incident-reports/models/pagination";
import { AppConfigService } from "@app/services/app-config.service";

@Injectable()
export class IncidentReportService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/incident-reports", appConfigService);
  }

  async get(id: string, source: number): Promise<IncidentReport> {
    return this.http
      .get<IncidentReport>(this.apiBase + "/" + id + "?source=" + source)
      .toPromise();
  }

  async list(filter: FormGroup): Promise<PaginationResult<IncidentReport>> {
    return this.http
      .post<PaginationResult<IncidentReport>>(this.apiBase + "/list", filter)
      .toPromise();
  }

  async insert(incidentReport: FormGroup): Promise<string> {
    return this.http.post<string>(this.apiBase, incidentReport).toPromise();
  }

  async edit(incidentReport: FormGroup): Promise<string> {
    return this.http.put<string>(this.apiBase, incidentReport).toPromise();
  }

  async filter(id: string): Promise<IncidentReport[]> {
    return this.http
      .get<IncidentReport[]>(this.apiBase + "/filter/" + id)
      .toPromise();
  }

  async archive(id: string): Promise<boolean> {
    return this.http.delete<boolean>(this.apiBase + "/" + id).toPromise();
  }

  // Helpers
  getIcon(category: string, source: number, riskLevel: number): any {
    let sourceType = "e" + riskLevel;

    if (source === 0) {
      sourceType = "i";
    }

    let iconUrl =
      "/assets/img/incident-reports/" + category + "_" + sourceType + ".png";

    return iconUrl;
  }
}
