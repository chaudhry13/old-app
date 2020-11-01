import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Route,
  Router,
} from "@angular/router";
import { AuthService } from '@app/services/auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    var hasAccessToken = this.auth.oAuth.hasValidAccessToken();
    if (!hasAccessToken) {
      this.router.navigate(["/login"]);
    } else {
      return hasAccessToken;
    }
  }
}
