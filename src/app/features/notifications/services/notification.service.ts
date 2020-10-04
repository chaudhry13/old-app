import { GenericService } from "@app/services/generic.service";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

import { Notification } from "../models/notification";
import { AppConfigService } from "@app/services/auth-config.service";

@Injectable()
export class NotificationService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/notifications", appConfigService);
  }

  list(expired: boolean): Promise<Notification[]> {
    const parameters = new HttpParams().set("read", String(expired));

    return this.http
      .get<Notification[]>(this.apiBase + "/list", {
        params: parameters
      })
      .toPromise();
  }

  read(id: string): Promise<boolean> {
    return this.http.get<boolean>(this.apiBase + "/update/" + id).toPromise();
  }

  readAll(): Promise<boolean> {
    return this.http.get<boolean>(this.apiBase + "/update").toPromise();
  }

  count(): Observable<number> {
    return this.http.get<number>(this.apiBase + "/count");
  }
}
