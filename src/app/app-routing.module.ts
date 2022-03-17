import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@app/guards/auth.guard";
import { LoggedInGuard } from "@app/guards/logged-in.guard";
import { Deeplinks } from "@awesome-cordova-plugins/deeplinks/ngx";
import { ErrorPageComponent } from "./error-page/error-page.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: "home",
    component: HomeComponent,
    canActivate: [LoggedInGuard],
  },
  {
    path: "tabs",
    canActivate: [AuthGuard],
    //canActivateChild: [AuthGuard],
    loadChildren: () =>
      import("./features/tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  { path: "", redirectTo: "home", pathMatch: "full" },
  { path: "**", redirectTo: "home" },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
      enableTracing: false,
      initialNavigation: "enabledNonBlocking",
      useHash: false,
      onSameUrlNavigation: "reload",
      relativeLinkResolution: "legacy",
    }),
  ],
  exports: [RouterModule],
  providers: [
    Deeplinks
  ]
})
export class AppRoutingModule {}
