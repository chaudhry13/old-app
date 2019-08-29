import { User } from "./../_models/user";
import { Injectable } from "@angular/core";
import { OAuthService } from "angular-oauth2-oidc";

@Injectable()
export class SettingsService {
	public organizationId: string;

	public advancedConsequence: boolean;

	public riskAssessmentArea: boolean;
	public incidentReportsArea: boolean;
	public auditsArea: boolean;
	public healthSafetyArea: boolean;

	public riskline: boolean;
	public controlrisks: boolean;

	public currency: string;
	public shortname: string;

	public external: boolean;

	constructor(public authService: OAuthService) {
		let token = this.authService.getAccessToken();
	}

	public getWhiteLabel(shortname: string) {
		switch (shortname) {
			case "humanrisks":
				return "#2b3245";
			case "facebook":
				return "#4267b2";
			case "f1":
				return "#1a1918";
			case "securitas":
				return "#1a1918";
			case "ikea":
				return "#2b3245";
			case "arla":
				return "#2b3245";
			case "booking":
				return "#2b3245";
			case "gategourmet":
				return "#2b3245";
			case "maersk":
				return "#42B0D5";
			default:
				return "#2b3245";
		}
	}

	public getWhiteLabelLogo(shortname: string) {
		switch (shortname) {
			case "humanrisks":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "facebook":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "f1":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "securitas":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "ikea":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "arla":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "booking":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "gategourmet":
				return "/assets/img/logos/" + shortname + "_logo.png";
			case "maersk":
				return "/assets/img/logos/" + shortname + "_logo.png";
			default:
				return "/assets/img/logos/humanrisks_logo.png";
		}
	}
}
