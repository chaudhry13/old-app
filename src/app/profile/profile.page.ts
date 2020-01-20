import { Component, OnInit } from "@angular/core";
import { UserService } from "../_services/user.service";
import { DivisionService } from "../_services/division.service";
import { TokenService } from "../_services/token.service";
import { User } from "../_models/user";
import { Observable } from 'rxjs';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  user: User;

  constructor(public userService: UserService, public divisionService: DivisionService, public tokenService: TokenService, public oAuthService: OAuthService) { }

  ngOnInit() {
    this.tokenService.readToken(this.oAuthService.getAccessToken());
    this.user = this.tokenService.getUser();

    this.divisionService.list().then(
      data => {
        console.log("Divisions List in component");
        console.log(data);
        this.user.divisions = data
      }
    );
    console.log("Users divs: " + this.user.divisions);
  }

  logout() {
    // Not implemented yet! :-P
  }

}
