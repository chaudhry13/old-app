import { Injectable } from "@angular/core";
import { User } from "../_models/user";
import { Storage } from "@ionic/storage";

@Injectable()
export class TokenService {
  user: User;

  constructor(private storage: Storage) { }

  public readToken(token: string) {
    const tokens: Array<any> = token.split(".");
    const decoded = this.decodeB64(tokens[1]);
    const tokenPayload: any = JSON.parse(decoded);

    this.user = new User();

    this.user.id = tokenPayload.sub;
    this.user.email = tokenPayload.email;
    this.user.name = tokenPayload.given_name;
    this.user.role = tokenPayload.role;
    this.user.organization = tokenPayload.organization;
    this.user.riskline = tokenPayload.riskline.toLowerCase() == "true" ? true : false;
    this.user.controlrisks = tokenPayload.controlrisks.toLowerCase() == "true" ? true : false;
    this.user.advancedConsequence = tokenPayload.advancedconsequence.toLowerCase() == "true" ? true : false;
    this.user.currency = tokenPayload.currency;
    this.user.shortname = tokenPayload.shortname;
    this.user.termsaccepted = tokenPayload.termsaccepted.toLowerCase() == "true" ? true : false;
    this.user.external = tokenPayload.external.toLowerCase() == "true" ? true : false;

    // Areas
    this.user.auditsArea = tokenPayload.auditsarea.toLowerCase() == "true" ? true : false;
    this.user.riskAssessmentsArea = tokenPayload.riskassessmentsarea.toLowerCase() == "true" ? true : false;
    this.user.incidentsArea = tokenPayload.incidentsarea.toLowerCase() == "true" ? true : false;
    this.user.healthSafetyArea = tokenPayload.healthsafetyarea.toLowerCase() == "true" ? true : false;

    // Save auth config
    this.storage.set("client_id", tokenPayload.client_id);
    this.storage.set("iss", tokenPayload.iss);
    this.storage.set("scope", tokenPayload.scope);
    this.storage.set("logout_url", tokenPayload.iss + "/account/logout");
    this.storage.set("redirect_uri", "http://localhost:8100/callback");
    this.storage.set("oidc", false);

    // TODO: Api url should be sent in token aswell.
    //this.storage.set("api_url", )
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
