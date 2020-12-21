import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { FormGroup } from "@angular/forms";
import { Division } from "@app/models/division";
import { AppConfigService } from "@app/services/auth-config.service";
import { DivisionService } from "@app/services/division.service";
import { GenericService } from "@app/services/generic.service";

@Injectable({
    providedIn: "root"
})
export class ActivityLogService extends GenericService {
    constructor(private http: HttpClient, public appConfigService: AppConfigService, public divisionService: DivisionService) {
        super("/activitylogs", appConfigService);
    }

    public getDivisionsWithManagers(): Promise<Division[]> {
        return this.http.post<Division[]>(this.apiBase + "/getdivisions?withManagers=true", { withManagers: true }).toPromise();
    }

    public getDivisionsWithoutManagers(): Promise<Division[]> {
        return this.http.post<Division[]>(this.apiBase + "/getdivisions", { withManagers: false }).toPromise();
    }

    public getActivityGuid(): Promise<string> {
        return this.http.get<string>(this.apiBase + "/activity/generate-guid").toPromise();
    }

    public createActivity(activityData: FormGroup): Promise<string> {
        return this.http.post<string>(this.apiBase + "/activity", activityData.value).toPromise();
    }
}
