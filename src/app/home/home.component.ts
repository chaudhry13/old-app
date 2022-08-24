import { Component, NgZone, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { OrgConfig } from "@app/interfaces/org-config";
import { AppConfigService } from "@app/services/app-config.service";
import { ToastService } from "@app/services/toast.service";
import {
  InAppBrowser,
  InAppBrowserOptions,
} from "@ionic-native/in-app-browser/ngx";
import { AuthService } from "../auth/auth.service";
import { Browser } from "@capacitor/browser";
import { Platform } from "@ionic/angular";
import { configureAuth } from "../auth.init";
import { Router } from "@angular/router";

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
    private toastService: ToastService,
    private iab: InAppBrowser,
    private router: Router,
    private ngZone: NgZone,
    private platform: Platform
  ) {
    this.form = fb.group({
      orgName: ["", Validators.required],
    });
  }

  ngOnInit() {}

  async onSubmit($event: Event) {
    try {
      $event.preventDefault();
      await this.configService.setConfigFromOrgName(
        this.form.get("orgName").value
      );
      await configureAuth(
        this.configService,
        this.platform,
        this.ngZone,
        this.auth,
        this.router
      );
      this.auth.login();
    } catch (e) {
      console.log(e);
      this.toastService.show("Invalid Organization!", "danger");
    }
  }
}
