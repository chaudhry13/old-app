import { GenericService } from "@app/services/generic.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { FollowUp } from "../models/follow-up";
import { Observable } from "rxjs";
import { AppConfigService } from "@app/services/app-config.service";

@Injectable()
export class FollowUpService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/follow-ups", appConfigService);
  }

  async get(id: string): Promise<FollowUp> {
    return this.http.get<FollowUp>(this.apiBase + "/" + id).toPromise();
  }

  async list(
    divisionIds: string[],
    search: string,
    type: string,
    completed: boolean
  ): Promise<FollowUp[]> {
    const filter = {
      divisionIds,
      search,
      type,
      completed,
    };

    return this.http.post<any>(this.apiBase + "/list/", filter).toPromise();
  }

  async edit(form: FormGroup): Promise<string> {
    return this.http.put<string>(this.apiBase, form).toPromise();
  }

  private csv(followUpIds: string[], organizationId: string): Observable<Blob> {
    return this.http.post(
      "https://app.humanrisks.com/followup/export",
      {
        followUpIds,
        organizationId,
      },
      { responseType: "blob" }
    );
  }

  downloadHistory(followUpIds: string[], organizationId: string) {
    this.csv(followUpIds, organizationId).subscribe((blob) => {
      const csv = new Blob([blob], { type: "text/csv" });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(csv);
        return;
      }

      const data = window.URL.createObjectURL(csv);

      const link = document.createElement("a");
      link.href = data;
      link.download = "follow-up-history.csv";

      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }
}
