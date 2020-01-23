import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";
import { AlertController } from "@ionic/angular";
import { TokenService } from "../_services/token.service";
import { Storage } from "@ionic/storage";
import { AppConfigService } from '../_services/auth-config.service';

@Component({
  selector: "callback",
  templateUrl: "callback.component.html"
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private oAuthService: OAuthService,
    public alertController: AlertController,
    public tokenService: TokenService,
    private appConfigService: AppConfigService
  ) { }

  ngOnInit() {
    this.oAuthService.tryLogin();
    // this.tokenService.readToken(this.oAuthService.getAccessToken());

    if (this.oAuthService.hasValidAccessToken()) {
      console.log("Callback 1: " + this.appConfigService.apiBaseUrl);
      console.debug("Access token:");
      console.debug(this.oAuthService.getAccessToken());
      this.router.navigate([""]);
    } else {
      console.log("Callback sends us back!!!");
      this.router.navigate(["/login"]);
    }
  }
}
