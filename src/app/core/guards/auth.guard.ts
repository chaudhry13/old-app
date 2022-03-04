import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Route,
  Router,
} from "@angular/router";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("in guard");

    return this.auth.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => {
        console.log(isAuthenticated);
        if (isAuthenticated) return true;
        this.auth.login();
        return false;
      })
    );
  }
}
