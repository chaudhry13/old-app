import { Injectable } from "@angular/core";
import { User } from "../models/user";
import { AppConfigService } from "./auth-config.service";
import { Storage } from "@ionic/storage";

@Injectable()
export class TokenService {
  user: User;

  constructor() { }

  public readToken(token: string) {
    const tokenPayload = this.getTokenPayload(token);

    this.user = new User();

    this.user.id = tokenPayload.sub;
    this.user.email = tokenPayload.email;
    this.user.name = tokenPayload.given_name;
    this.user.role = tokenPayload.role;
    this.user.organization = tokenPayload.organization;
    this.user.riskline =
      tokenPayload.riskline.toLowerCase() == "true";
    this.user.controlrisks =
      tokenPayload.controlrisks.toLowerCase() == "true";
    this.user.advancedConsequence =
      tokenPayload.advancedconsequence.toLowerCase() == "true";
    this.user.currency = tokenPayload.currency;
    this.user.shortname = tokenPayload.shortname;
    this.user.termsaccepted =
      tokenPayload.termsaccepted.toLowerCase() == "true";
    this.user.external =
      tokenPayload.external.toLowerCase() == "true";

    // Areas
    this.user.auditsArea =
      tokenPayload.auditsarea.toLowerCase() == "true";
    this.user.riskAssessmentsArea =
      tokenPayload.riskassessmentsarea.toLowerCase() == "true";
    this.user.incidentsArea =
      tokenPayload.incidentsarea.toLowerCase() == "true";
    this.user.healthSafetyArea =
      tokenPayload.healthsafetyarea.toLowerCase() == "true";
  }

  public getTokenPayload(token: string): any {
    const tokens: Array<any> = token.split(".");
    const decoded = this.decodeB64(tokens[1]);
    const tokenPayload: any = JSON.parse(decoded);
    return tokenPayload;
  }

  public getUser(): User {
    return this.user;
  }

  private decodeB64(payload: string) {
    return decodeURIComponent(
      Array.prototype.map
        .call(atob(payload), function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
  }
}
