import { Component, OnInit } from "@angular/core";
import { UserService } from "../_services/user.service";
import { DivisionService } from "../_services/division.service";
import { TokenService } from "../_services/token.service";
import { User } from "../_models/user";
import { Observable } from 'rxjs';
import { OAuthErrorEvent, OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
import { routerNgProbeToken } from '@angular/router/src/router_module';
import { AccountService } from '../_services/account.service';
import { Division } from '../_models/division';

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
  divisions: Division[] = [];
  user: User = new User();
  constructor(public userService: UserService, public divisionService: DivisionService, public accountService: AccountService, public oAuthService: OAuthService, private router: Router) { }

  ngOnInit() {
    this.divisionService.list().then(
      data => {
        this.divisions = data
        this.divisions.forEach(d => console.log(d.name));
      }
    );

    this.accountService.get().then(user => {
      this.user = user;
    });
  }

  logout() {
    this.oAuthService.logOut(true);
    localStorage.clear();
    setTimeout(() => {
      this.router.navigate(["/login"]);
    }, 1000);
  }
}
