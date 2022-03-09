import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { Observable } from "rxjs";
import { AppConfigService } from "../services/app-config.service";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(private auth: AuthService, private config: AppConfigService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    // Only attach access token to calls made to the api url, after config is loaded (previous call is to laod config)
    if (
      this.config.orgConfig &&
      req.url.startsWith(this.config.orgConfig.apiServer)
    ) {
      let token = this.auth.getAccessToken();
      if (token) {
        req = req.clone({
          setHeaders: {
            Authorization: "Bearer " + token,
            Accept: "application/json",
          },
        });
      } else {
        req = req.clone({
          setHeaders: {
            Accept: "application/json",
          },
        });
      }
    }

    return next.handle(req);
  }
}
