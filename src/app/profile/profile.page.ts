import { Component, OnInit } from "@angular/core";
import { UserService } from "../_services/user.service";
import { DivisionService } from "../_services/division.service";
import { TokenService } from "../_services/token.service";
import { User } from "../_models/user";

@Component({
	selector: "app-profile",
	templateUrl: "./profile.page.html",
	styleUrls: ["./profile.page.scss"]
})
export class ProfilePage implements OnInit {
	user: User;

	constructor(public userService: UserService, public divisionService: DivisionService, public tokenService: TokenService) {}

	ngOnInit() {
		this.user = this.tokenService.getUser();
	}
}
