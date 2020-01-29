import { Component, OnInit } from "@angular/core";
import { OAuthService, AuthConfig, OAuthErrorEvent } from "angular-oauth2-oidc";
import { Router } from "@angular/router";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { AlertController, Platform } from "@ionic/angular";
import { Device } from "@ionic-native/device/ngx";
import { AppConfigService } from '../_services/auth-config.service';
import { TokenService } from '../_services/token.service';

declare const window: any;

@Component({
  selector: "login-page",
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {
  constructor(private oauthService: OAuthService, private router: Router, private inAppBrowser: InAppBrowser, private device: Device, private platform: Platform, private appConfigService: AppConfigService, private tokenService: TokenService) {
    oauthService.redirectUri = "http://localhost:8100/callback";
  }

  ngOnInit() {
    console.log("Login init");
    this.appConfigService.loadAppConfig();
  }

  redirectLogin() {
    if (window.cordova) {
      var authConfigLogin = this.appConfigService.appConfig;
      console.log("Before Login -> clientId: " + authConfigLogin.clientId);
      console.log("Before Login -> issuer: " + authConfigLogin.issuer);
      console.log("Before Login -> scope: " + authConfigLogin.scope);
      console.log("Before Login -> logoutUrl: " + authConfigLogin.logoutUrl);
      console.log("Before Login -> redirectUri: " + authConfigLogin.redirectUri);
      console.log("Before Login -> oidc: " + authConfigLogin.oidc);
      console.log("Before Login -> apiUrl: " + authConfigLogin.apiUrl);
      this.oauthService.configure(authConfigLogin);
      this.loginDevice().then(
        success => {
          const idToken = success.id_token;
          const accessToken = success.access_token;
          const keyValuePair = `#id_token=${encodeURIComponent(idToken)}&access_token=${encodeURIComponent(accessToken)}`;
          console.log("\n" + "key val pair:" + keyValuePair + "\n");
          this.oauthService.tryLogin({
            customHashFragment: keyValuePair,
            disableOAuth2StateCheck: true
          });
          this.router.navigate(["/callback"]);
        },
        error => {
          console.log(error);
        }
      );
    } else {
      this.loginWeb();
    }
  }

  loginWeb() {
    this.oauthService.initImplicitFlow();
  }

  loginDevice(): Promise<any> {
    console.log("Login.component: LoginDevice");
    return this.oauthService.createAndSaveNonce().then(nonce => {
      let state: string = Math.floor(Math.random() * 1000000000).toString();
      if (window.crypto) {
        const array = new Uint32Array(1);
        window.crypto.getRandomValues(array);
        state = array.join().toString();
      }
      return new Promise((resolve, reject) => {
        const oauthUrl = this.buildOAuthUrl(state);
        console.log("Login.component: oauthUrl: " + oauthUrl);

        const browser = this.inAppBrowser.create(oauthUrl, "_blank", "location=no,clearsessioncache=yes,clearcache=yes");
        console.log("Login.component: Post browser 1");

        browser.on("loaderror").subscribe(error => {
          console.log(error);
        })
        browser.on("loadstart").subscribe(event => {
          console.log(event)
          console.log("valid token:" + this.oauthService.hasValidAccessToken());
          console.log("Login.component: Post browser 2: " + event.url);
          if (event.url.indexOf("http://localhost:8100/callback") === 0) {

            const responseParameters = event.url.split("#")[1].split("&");

            const parsedResponse = {};

            for (let i = 0; i < responseParameters.length; i++) {
              parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
            }
            console.log("Calling readToken in loadstart 1");
            this.tokenService.readToken(parsedResponse["access_token"]);
            console.log("Calling readToken in loadstart 2");
            const defaultError = "Problem authenticating with Okta";

            browser.on("exit").subscribe(() => { });

            browser.close();

            if (parsedResponse["state"] !== state) {
              reject(defaultError);
            } else if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
              resolve(parsedResponse);
            } else {
              reject(defaultError);
            }
          }
        });
        browser.on("exit").subscribe(() => {
          console.log("Login.component: browser exit 2");
          this.appConfigService.loadAppConfig();
          var authConfigLogin = this.appConfigService.appConfig;
          console.log("browser exit 2 -> clientId: " + authConfigLogin.clientId);
          console.log("browser exit 2 -> issuer: " + authConfigLogin.issuer);
          console.log("browser exit 2 -> scope: " + authConfigLogin.scope);
          console.log("browser exit 2 -> logoutUrl: " + authConfigLogin.logoutUrl);
          console.log("browser exit 2 -> redirectUri: " + authConfigLogin.redirectUri);
          console.log("browser exit 2 -> oidc: " + authConfigLogin.oidc);
          console.log("browser exit 2 -> apiUrl: " + authConfigLogin.apiUrl);
        });
      });
    });
  }

  buildOAuthUrl(state): string {
    return (
      this.oauthService.issuer +
      "/Account/Login?ReturnUrl=%2Fconnect%2Fauthorize%2Fcallback%3Fresponse_type%3Dtoken%26client_id%3Dionic%26state%3D" +
      state +
      "%26redirect_uri%3D" +
      this.oauthService.redirectUri +
      "%26scope%3D" +
      this.oauthService.scope
    );
  }
}
