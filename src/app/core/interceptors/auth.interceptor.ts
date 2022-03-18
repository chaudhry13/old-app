import { Injectable } from "@angular/core";
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from "@angular/common/http";
import { EMPTY, Observable } from "rxjs";
import { AppConfigService } from "../services/app-config.service";
import { AuthService } from "src/app/auth/auth.service";
import { GenericService } from "@app/services/generic.service";
import { catchError } from "rxjs/operators";
import { Router } from "@angular/router";

@Injectable()
export class TokenInterceptor implements HttpInterceptor {
  constructor(
    private auth: AuthService, 
    private config: AppConfigService,
    private router: Router
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    const apiServer = this.config?.orgConfig?.apiServer;
    // Only attach access token to calls made to the api url, after config is loaded (previous call is to laod config)
    if (apiServer && req.url.startsWith(apiServer)) {
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

    return next.handle(req).pipe(catchError(err => {
      if (err.status === 401) {
        this.router.navigate(['/home']);
      }
      return EMPTY;
    }));
  }
}
