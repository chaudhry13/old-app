import { Observable } from "rxjs";
import { User } from "./../_models/user";
import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { GenericService } from "./generic.service";
import { FormGroup } from "@angular/forms";

@Injectable()
export class UserService extends GenericService {
	public role: string;

	constructor(private http: HttpClient) {
		super("/users");
	}

	get(id: string): Observable<User> {
		return this.http.get<User>(this.apiBase + "/" + id);
	}

	list(divisions: string[], search: string): Observable<User[]> {
		var filter = {
			divisions: divisions,
			search: search
		};

		return this.http.post<User[]>(this.apiBase + "/list", filter);
	}

	async insert(user: FormGroup): Promise<boolean> {
		return this.http.post<boolean>(this.apiBase, user).toPromise();
	}

	async update(user: FormGroup): Promise<boolean> {
		return this.http.put<boolean>(this.apiBase, user).toPromise();
	}

	async migrate(id: string, migrateId: string): Promise<boolean> {
		return this.http.get<boolean>(this.apiBase + "/migrate?id=" + id + "&migrateId=" + migrateId).toPromise();
	}
}
