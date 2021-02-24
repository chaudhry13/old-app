import { Component, OnInit } from "@angular/core";
import { NavController } from "@ionic/angular";
import { TokenService } from "@app/services/token.service";
import { OAuthService } from "angular-oauth2-oidc";

@Component({
  selector: "callback",
  templateUrl: "callback.component.html",
})
export class CallbackComponent implements OnInit {
  constructor(
    private authService: OAuthService,
    public tokenService: TokenService,
    private navController: NavController
  ) { }

  ngOnInit() {
  }

  ionViewDidEnter() {
    this.tryToLogin();
  }

  private tryToLogin() {
    this.authService.tryLogin().then(success => {
      if (success || this.authService.hasValidAccessToken()) {
        this.navController.navigateRoot("/").then(() => {
          console.debug("Has valid token, navigating from callback to root '/'");
        });
      } else {
        this.navController.navigateRoot("/login").then(() => {
          console.debug("no valid token, navigating from callback to login");
        });
      }
    });
  }
}
