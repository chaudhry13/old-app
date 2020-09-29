import { GenericService } from "../services/generic.service";
import { Injectable, Injector } from "@angular/core";
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from "@angular/common/http";
import { Observable } from "rxjs";
import { Router } from "@angular/router";
import { catchError } from "rxjs/operators";
import { OAuthService } from "angular-oauth2-oidc";
import { AppConfigService } from '../services/auth-config.service';

@Injectable()
export class TokenInterceptor extends GenericService implements HttpInterceptor {
  constructor(public injector: Injector, private router: Router, private authService: OAuthService, appConfigService: AppConfigService) {
    super("", appConfigService);
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.url.startsWith(this.apiBase)) {

      if (req.url.includes("reset-password")) {
        return next.handle(req);
      }

      let token = this.authService.getAccessToken();

      req = req.clone({
        setHeaders: {
          Authorization: "Bearer " + token,
          Accept: "application/json"
        }
      });

      return next.handle(req).pipe(
        catchError((error: any, caught: Observable<HttpEvent<any>>) => {
          if (error.status === 401) {
            this.handleAuthError();
          } else {
            console.debug("On Error Status: " + error.Status);
          }

          throw error;
        })
      );
    }

    return next.handle(req);
  }

  private handleAuthError() {
    this.router.navigate(["/login"]);
  }
}
