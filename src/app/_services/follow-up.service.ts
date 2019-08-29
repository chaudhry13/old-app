import { GenericService } from "./generic.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Audit } from "../_models/audit";
import { FollowUp } from "../_models/follow-up";
import { Observable } from "rxjs";

@Injectable()
export class FollowUpService extends GenericService {
  constructor(private http: HttpClient) {
    super("/follow-ups");
  }

  async get(id: string): Promise<FollowUp> {
    return this.http.get<FollowUp>(this.apiBase + "/" + id).toPromise();
  }

  async list(divisionIds: string[], search: string, type: string, completed: boolean): Promise<FollowUp[]> {
    let filter = {
      divisionIds: divisionIds,
      search: search,
      type: type,
      completed: completed
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
        followUpIds: followUpIds,
        organizationId: organizationId
      },
      { responseType: "blob" }
    );
  }

  downloadHistory(followUpIds: string[], organizationId: string) {
    this.csv(followUpIds, organizationId).subscribe(blob => {
      var csv = new Blob([blob], { type: "text/csv" });

      if (window.navigator && window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveOrOpenBlob(csv);
        return;
      }

      const data = window.URL.createObjectURL(csv);

      var link = document.createElement("a");
      link.href = data;
      link.download = "follow-up-history.csv";

      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, view: window }));

      setTimeout(function() {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
      }, 100);
    });
  }
}
