import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";

@Injectable({
  providedIn: "root"
})
export class AuthService {

  constructor(public oAuth: OAuthService) { }
}
