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

    if (this.oAuthService.hasValidAccessToken()) {
      setTimeout(() => {
        this.router.navigate([""]);
      }, 1000);
    } else {
      this.router.navigate(["/login"]);
    }
  }
}
