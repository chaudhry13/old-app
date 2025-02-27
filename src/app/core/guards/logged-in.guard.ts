import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  RouterStateSnapshot,
  Route,
  Router,
} from "@angular/router";
import { NavController } from "@ionic/angular";
import { map } from "rxjs/operators";
import { AuthService } from "src/app/auth/auth.service";

@Injectable({
  providedIn: "root",
})
export class LoggedInGuard implements CanActivate {
  constructor(private auth: AuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.auth.canLoadInGuard$.pipe(
      map(( {isAuthenticated} ) => {
        console.log("LoggedInGuard canActivate", isAuthenticated);
        if (isAuthenticated) {
          this.router.navigate(["tabs/tab1"]);
          return false;
        }
        return true;
      })
    );
  }
}
