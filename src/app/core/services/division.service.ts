import { Observable, Subject } from "rxjs";
import { Division } from "../models/division";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { GenericService } from "./generic.service";
import { FormGroup } from "@angular/forms";
import { AppConfigService } from "./app-config.service";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class DivisionService extends GenericService {
  selected$: Observable<any>;

  divisions: string[] = new Array();

  private subject = new Subject<any>();

  constructor(
    private http: HttpClient,
    private auth: AuthService,
    appConfigService: AppConfigService
  ) {
    super("/divisions", appConfigService);

    this.selected$ = this.subject.asObservable();
  }

  set(divisions: Division[]) {}

  selected(data) {
    this.divisions = data;

    this.subject.next(data);
  }
  get(): string[] {
    return this.divisions;
  }

  async list(): Promise<Division[]> {
    return this.http.get<Division[]>(this.apiBase + "/list").toPromise();
  }

  async insert(name: string): Promise<boolean> {
    const parameters = new HttpParams().set("name", name);

    return this.http
      .post<boolean>(this.apiBase, "", {
        params: parameters,
      })
      .toPromise();
  }

  async update(division: FormGroup): Promise<boolean> {
    return this.http.put<boolean>(this.apiBase, division).toPromise();
  }
}
