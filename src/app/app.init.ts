import { NgZone } from "@angular/core";
import { Router } from "@angular/router";
import { OrgConfig } from "@app/interfaces/org-config";
import { AppConfigService } from "@app/services/app-config.service";
import { StatusBar } from "@capacitor/status-bar";
import { Platform } from "@ionic/angular";
import { AuthService } from "./auth/auth.service";
import { SplashScreen } from '@capacitor/splash-screen';

export const beforeAppInit = (
    appConfigService: AppConfigService,
    auth: AuthService,
    platform: Platform,
    zone: NgZone,
    router: Router
  ) => {
    const outerPromise = new Promise<void>(async (resolve, reject) => {
      console.log("beforeAppInit");
      await platform.ready();
      console.log("platform ready");
      SplashScreen.hide();
      console.log("splash hidden");
      if (platform.is("android")) StatusBar.setOverlaysWebView({ overlay: false });
      console.log("status bar overlay set");
      // In order to load the google script with dynamic API key, we need to first load config, then attach script to body.
      // script.onload/onerror is necessary, otherwise there is a timeing error, even though it should be syncronous
      appConfigService.setConfigFromOrgName(await appConfigService.getCached<string>("orgConfig")).then(async () => {
        console.log("orgConfig loaded");
        const x = appConfigService.orgConfig;
        if (x) {
          appConfigService.orgConfig = x;
          // start auth based on config
          await auth.initLoginV2();
        
          const script = document.createElement("script");
          script.src = `https://maps.googleapis.com/maps/api/js?key=${x.googleApiKey}&libraries=places,visualization`;
          script.async = true;
          script.defer = true;
          document.body.appendChild(script);
          script.onload = () => resolve();
          script.onerror = () => resolve();
        } else {
          // No config, so just check for valid tokens, and if not redirect to login
          await auth.initLoginV2();
          console.log("default home route");
          resolve();
        }
      });
    });

    return () => outerPromise;
  }