import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrgConfig } from "@app/interfaces/org-config";
import { AppConfigService } from "@app/services/app-config.service";
import { ToastService } from "@app/services/toast.service";
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
    private configService: AppConfigService,
    private toastService: ToastService
  ) {
    this.form = fb.group({
      orgName: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit($event: Event) {
    $event.preventDefault();
    this.setApplicationConfig(this.form.get("orgName").value)
      .then(this.onConfigSuccess)
      .catch(() => this.toastService.show("Invalid Organization!", "danger"));
  }

  async setApplicationConfig(orgName: string) {
    await this.configService.setConfigFromOrgName(orgName);
  }

  login() {
    this.auth.login();
  }

  onConfigSuccess = () => this.login();
}