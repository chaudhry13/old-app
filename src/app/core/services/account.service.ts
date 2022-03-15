import { GenericService } from "./generic.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { User } from "../models/user";
import { AppConfigService } from "./app-config.service";

@Injectable()
export class AccountService extends GenericService {
  constructor(private http: HttpClient, appConfigService: AppConfigService) {
    super("/account", appConfigService);
  }

  async get(): Promise<User> {
    return this.http.get<User>(this.apiBase).toPromise();
  }

  async update(user: FormGroup): Promise<boolean> {
    return this.http.put<boolean>(this.apiBase, user).toPromise();
  }

  async terms(): Promise<string> {
    return this.http.get<string>(this.apiBase + "/terms").toPromise();
  }

  async acceptTerms(): Promise<boolean> {
    return this.http.post<boolean>(this.apiBase + "/terms", null).toPromise();
  }
}
