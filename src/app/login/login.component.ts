import { Component, OnInit } from "@angular/core";
import { OAuthService, AuthConfig, OAuthErrorEvent } from "angular-oauth2-oidc";
import { Router } from "@angular/router";
import { InAppBrowser } from "@ionic-native/in-app-browser/ngx";
import { AlertController } from "@ionic/angular";
import { Device } from "@ionic-native/device/ngx";

declare const window: any;

@Component({
  selector: "login-page",
  templateUrl: "login.component.html"
})
export class LoginComponent implements OnInit {
  private cordova: boolean = false;

  constructor(private oauthService: OAuthService, private router: Router, private inAppBrowser: InAppBrowser, private device: Device) {
    oauthService.redirectUri = "http://localhost:8100/callback";
  }

  ngOnInit() { }

  redirectLogin() {
    if (this.cordova) {
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
            browser.on("exit").subscribe(() => { });

            browser.close();

            const responseParameters = event.url.split("#")[1].split("&");

            const parsedResponse = {};

            for (let i = 0; i < responseParameters.length; i++) {
              parsedResponse[responseParameters[i].split("=")[0]] = responseParameters[i].split("=")[1];
            }
            const defaultError = "Problem authenticating with Okta";

            if (parsedResponse["state"] !== state) {
              console.log("ERRRRRRORRRRR!!!!");
              reject(defaultError);
            } else if (parsedResponse["access_token"] !== undefined && parsedResponse["access_token"] !== null) {
              resolve(parsedResponse);
            } else {
              console.log("REJECTED!!!!");
              reject(defaultError);
            }
          }
        });
        browser.on("exit").subscribe(() => { console.log("Login.component: browser exit 2") });
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
