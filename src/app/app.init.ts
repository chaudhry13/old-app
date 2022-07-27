import { NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { OrgConfig } from "@app/interfaces/org-config";
import { AppConfigService } from "@app/services/app-config.service";
import { SplashScreen } from "@awesome-cordova-plugins/splash-screen/ngx";
import { StatusBar } from "@capacitor/status-bar";
import { Platform } from "@ionic/angular";
import { configureAuth, initAuthListeners } from "./auth.init";
import { AuthService } from "./auth/auth.service";

export const beforeAppInit = (
    appConfigService: AppConfigService,
    auth: AuthService,
    platform: Platform,
    splash: SplashScreen,
    zone: NgZone,
    router: Router
  ) => {
    const outerPromise = new Promise<void>(async (resolve, reject) => {
      await platform.ready();
      splash.hide();
      if (platform.is("android")) StatusBar.setOverlaysWebView({ overlay: false });
      // In order to load the google script with dynamic API key, we need to first load config, then attach script to body.
      // script.onload/onerror is necessary, otherwise there is a timeing error, even though it should be syncronous
      appConfigService.getCached<OrgConfig>("orgConfig").then(async (x) => {
        if (x) {
          appConfigService.orgConfig = x;
          await configureAuth(appConfigService, platform, splash, zone, auth, router);
          await initAuthListeners(platform, auth);
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${x.googleApiKey}&libraries=places,visualization`;
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
          script.onload = () => resolve();
          script.onerror = () => resolve();
        } else {
          await initAuthListeners(platform, auth);
          resolve();
        }
      });
    });

    return () => outerPromise;
  }