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
import { loadFactory } from "../auth/auth.module";
import { Router } from "@angular/router";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";

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
    private splashScreen: SplashScreen,
    private platform: Platform

  ) {
    this.form = fb.group({
      orgName: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit($event: Event) {
    $event.preventDefault();
    this.setApplicationConfig(this.form.get("orgName").value)
      .then(() => this.login())
      .catch((e) => this.toastService.show("Invalid Organization!", "danger"));
  }

  async setApplicationConfig(orgName: string) {
    await this.configService.setConfigFromOrgName(orgName);
  }

  async login() {
    loadFactory(this.configService, this.platform, this.splashScreen, this.ngZone, this.auth, this.router)().then(() => this.auth.login())
  }
}
