import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "@app/guards/auth.guard";
import { CallbackComponent } from "@app/authentication/callback/callback.component";
import { LoginComponent } from "@app/authentication/login/login.component";
import { HomeComponent } from "./home/home.component";

const routes: Routes = [
  {
    path: "",
    component: HomeComponent,
  },
  {
    path: "",
    canActivate: [AuthGuard],
    loadChildren: () =>
      import("./features/tabs/tabs.module").then((m) => m.TabsPageModule),
  },
  { path: "login", component: LoginComponent },
  { path: "callback", component: CallbackComponent },
  { path: "**", redirectTo: "" },
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
})
export class AppRoutingModule {}
