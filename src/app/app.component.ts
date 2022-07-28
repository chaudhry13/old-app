import { Component, NgZone } from "@angular/core";
import { NavController, Platform } from "@ionic/angular";
import { EMPTY, Subject } from "rxjs";
import { AuthService } from "./auth/auth.service";
import { mergeMap, takeUntil, tap } from "rxjs/operators";
import { Router } from "@angular/router";
import { App, URLOpenListenerEvent } from "@capacitor/app";
import { ToastService } from "@app/services/toast.service";
import { StatusBar, Style } from "@capacitor/status-bar";
import { Browser } from "@capacitor/browser";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
})
export class AppComponent {
  private unsub$ = new Subject<void>();

  constructor(
    private platform: Platform,
    private auth: AuthService,
    public navController: NavController,
    private router: Router,
    private zone: NgZone,
    private toast: ToastService
  ) {
  }

  ngOnDestroy(): void {
    this.unsub$.next();
    this.unsub$.complete();
  }

  
}
