import { Component, OnInit } from "@angular/core";
import { UserService } from "@app/services/user.service";
import { DivisionService } from "@app/services/division.service";
import { User } from "@app/models/user";
import { Router } from "@angular/router";
import { AccountService } from "@app/services/account.service";
import { Division } from "@app/models/division";
import { DivisionList } from "@shared/models/division-list";
import { AuthService } from "src/app/auth/auth.service";
import { Browser } from "@capacitor/browser";

@Component({
  selector: "app-profile",
  templateUrl: "./profile.page.html",
  styleUrls: ["./profile.page.scss"],
})
export class ProfilePage implements OnInit {
  divisions: Division[] = [];
  user: User;
  divisionList: DivisionList = new DivisionList();
  constructor(
    public userService: UserService,
    public divisionService: DivisionService,
    public accountService: AccountService,
    public auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.user = this.auth.user;
    this.auth.user$.subscribe((user) => {
        this.user = user;
    });
    this.listProfileInfo();
  }

  ionViewWillEnter() {
    this.listProfileInfo();
  }

  private listProfileInfo() {
    this.divisionList.asFilter = false;
    this.divisionList.toplevelDivisions = [];
    this.divisionService.list().then((data) => {
      this.divisions = data.filter((d) => !d.individualDivision);
      this.divisionList.makeDivisionNodes(this.divisions);
    });
  }

  logout() {
    this.auth.logout();
  }
}
