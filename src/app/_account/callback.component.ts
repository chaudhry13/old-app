import { Component, OnInit, AfterViewInit } from "@angular/core";
import { Router } from "@angular/router";
import { OAuthService } from "angular-oauth2-oidc";
import { AlertController } from "@ionic/angular";
import { TokenService } from "../_services/token.service";
import { Storage } from '@ionic/storage';

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
    private storage: Storage
  ) { }

  ngOnInit() {
    this.oAuthService.tryLogin();

    setTimeout(() => {
      if (this.oAuthService.hasValidAccessToken()) {
        this.tokenService.readToken(this.oAuthService.getAccessToken());
        console.debug("Access token:");
        console.debug(this.oAuthService.getAccessToken());
        this.router.navigate([""]);
      } else {
        this.router.navigate(["/login"]);
      }
    }, 500);
  }

  // saveAuthConfig(token: any) {
  //   this.storage.set('issuer', 'Max');
  // }
}
