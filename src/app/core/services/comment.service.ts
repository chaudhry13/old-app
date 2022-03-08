import { Injectable } from "@angular/core";
import { GenericService } from "@app/services/generic.service";
import { HttpClient } from "@angular/common/http";
import { Comment, CommentType } from "@app/models/comment";
import { FormGroup } from "@angular/forms";
import { AppConfigService } from "@app/services/app-config.service";

@Injectable()
export class CommentService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/comments", appConfigService);
  }

  async list(id: string, commentType: CommentType): Promise<Comment[]> {
    return this.http
      .get<Comment[]>(
        this.apiBase + "/list/" + id + "?commentType=" + commentType
      )
      .toPromise();
  }

  async insert(comment: FormGroup): Promise<string> {
    return this.http.post<string>(this.apiBase, comment).toPromise();
  }

  async insertComment(body: any): Promise<string> {
    return this.http.post<string>(this.apiBase, body).toPromise();
  }

  async delete(id: string): Promise<boolean> {
    return this.http.delete<boolean>(this.apiBase + "/" + id).toPromise();
  }
}
