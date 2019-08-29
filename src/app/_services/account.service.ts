import { GenericService } from "./generic.service";
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { User } from "../_models/user";

@Injectable()
export class AccountService extends GenericService {
  constructor(private http: HttpClient) {
    super("/account");
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
