import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { HttpClient } from "@angular/common/http";
import { Comment, CommentType } from "../_models/comment";
import { FormGroup } from "@angular/forms";

@Injectable()
export class CommentService extends GenericService {
  constructor(private http: HttpClient) {
    super("/comments");
  }

  async list(id: string, commentType: CommentType): Promise<Comment[]> {
    return this.http.get<Comment[]>(this.apiBase + "/list/" + id + "?commentType=" + commentType).toPromise();
  }

  async insert(comment: FormGroup): Promise<string> {
    return this.http.post<string>(this.apiBase, comment).toPromise();
  }

  async delete(id: string): Promise<boolean> {
    return this.http.delete<boolean>(this.apiBase + "/" + id).toPromise();
  }
}
