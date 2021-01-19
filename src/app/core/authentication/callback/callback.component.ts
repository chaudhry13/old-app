import { Component, OnInit } from "@angular/core";
import { AlertController, NavController } from "@ionic/angular";
import { TokenService } from "@app/services/token.service";
import { AuthService } from "@app/services/auth.service";

@Component({
  selector: "callback",
  templateUrl: "callback.component.html",
})
export class CallbackComponent implements OnInit {
  constructor(
    private authService: AuthService,
    public alertController: AlertController,
    public tokenService: TokenService,
    private navController: NavController
  ) { }

  ngOnInit() {
    this.authService.oAuth.tryLogin().then(success => {
      if (success || this.authService.oAuth.hasValidAccessToken()) {
        this.navController.navigateRoot("/");
      } else {
        this.navController.navigateRoot("/login");
      }
    });
  }

  ionViewWillEnter() {
    if (this.authService.oAuth.hasValidAccessToken()) {
      this.navController.navigateRoot("/");
    } else {
      this.navController.navigateRoot("/login");
    }
  }
}
