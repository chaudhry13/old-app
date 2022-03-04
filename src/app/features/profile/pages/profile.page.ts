import { Component, OnInit } from "@angular/core";
import { UserService } from "@app/services/user.service";
import { DivisionService } from "@app/services/division.service";
import { User } from "@app/models/user";
import { Router } from "@angular/router";
import { AccountService } from "@app/services/account.service";
import { Division } from "@app/models/division";
import { DivisionList } from "@shared/models/division-list";
import { OAuthService } from "angular-oauth2-oidc";
import { AuthService } from "src/app/auth/auth.service";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  divisions: Division[] = [];
  user: User = new User();
  divisionList: DivisionList = new DivisionList();
  constructor(
    public userService: UserService,
    public divisionService: DivisionService,
    public accountService: AccountService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.listProfileInfo();
  }

  ionViewWillEnter() {
    this.listProfileInfo();
  }

  private listProfileInfo() {
    this.divisionList.asFilter = false;
    this.divisionList.toplevelDivisions = [];
    this.divisionService.list().then((data) => {
      this.divisions = data;
      this.divisionList.makeDivisionNodes(data);
    });
    this.accountService.get().then((user) => {
      this.user = user;
    });
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
