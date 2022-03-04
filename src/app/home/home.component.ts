import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { AppConfigService } from "@app/services/app-config.service";
import { AuthService } from "../auth/auth.service";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  constructor(
    private fb: FormBuilder,
    public auth: AuthService,
    private configService: AppConfigService
  ) {
    this.form = fb.group({
      orgName: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit($event: Event) {
    $event.preventDefault();

    this.setApplicationConfig(this.form.get("orgName").value);
  }

  async setApplicationConfig(orgName: string) {
    await this.configService.setConfigFromOrgName(orgName);
  }

  logout() {
    this.auth.logout().subscribe();
  }

  login() {
    this.auth.login();
  }
}
