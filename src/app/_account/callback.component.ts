import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";
import { AlertController } from "@ionic/angular";
import { TokenService } from "../_services/token.service";

@Component({
  selector: "callback",
  templateUrl: "callback.component.html"
})
export class CallbackComponent implements OnInit {
  constructor(
    private router: Router,
    private oAuthService: OAuthService,
    public alertController: AlertController,
    public tokenService: TokenService
  ) { }

  ngOnInit() {
    this.oAuthService.tryLogin();

    setTimeout(() => {
      if (this.oAuthService.hasValidAccessToken()) {
        this.tokenService.readToken(this.oAuthService.getAccessToken());
        this.router.navigate([""]);
      } else {
        this.router.navigate(["/login"]);
      }
    }, 500);
  }
}
