import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Route,
  Router,
  CanActivateChild,
} from "@angular/router";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";

@Injectable()
export class AuthGuard implements CanActivate, CanActivateChild {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("guard");

    return this.auth.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => {
        console.log(isAuthenticated);

        if (isAuthenticated) {
          return true;
        }
        this.router.navigate(["home"]);
        return false;
      })
    );
  }

  canActivateChild(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    console.log("guard");

    return this.auth.isAuthenticated$.pipe(
      map(({ isAuthenticated }) => {
        console.log(isAuthenticated);

        if (isAuthenticated) {
          return true;
        }
        this.router.navigate(["home"]);
        return false;
      })
    );
  }
}
