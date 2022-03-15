import { Injectable } from "@angular/core";
import { GenericService } from "@app/services/generic.service";
import { HttpClient } from "@angular/common/http";
import { Comment, CommentType } from "@app/models/comment";
import { FormGroup } from "@angular/forms";
import { AppConfigService } from "@app/services/app-config.service";
import { IssueBase } from "src/app/features/audits/models/issue";

@Injectable()
export class IssueService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/issue", appConfigService);
  }

  async get(id: string): Promise<IssueBase> {
    return this.http.get<IssueBase>(this.apiBase + "/" + id).toPromise();
  }

  async insert(body: any): Promise<string> {
    return this.http.post<string>(this.apiBase + "/insert", body).toPromise();
  }
}
