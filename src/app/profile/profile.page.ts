import { Component, OnInit } from "@angular/core";
import { UserService } from "../_services/user.service";
import { DivisionService } from "../_services/division.service";
import { User } from "../_models/user";
import { OAuthService } from 'angular-oauth2-oidc';
import { Router } from '@angular/router';
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
    this.listProfileInfo();
  }

  ionViewWillEnter() {
    this.listProfileInfo();
  }
  private listProfileInfo() {
    this.divisionService.list().then(data => {
      this.divisions = data;
    });
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
