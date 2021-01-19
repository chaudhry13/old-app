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

  ionViewWillEnter() {
    this.authService.tryLogin().then(success => {
      if (success || this.authService.hasValidAccessToken()) {
        this.navController.navigateRoot("/");
      } else {
        this.navController.navigateRoot("/login");
      }
    });
  }
}
