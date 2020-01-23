import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./_guards/auth.guard";
import { CallbackComponent } from "./_account/callback.component";
import { LoginComponent } from "./login/login.component";

const routes: Routes = [
  { path: "", canActivate: [AuthGuard], loadChildren: "./tabs/tabs.module#TabsPageModule" },
  { path: "login", component: LoginComponent },
  { path: "callback", component: CallbackComponent },
  { path: "**", redirectTo: "" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules, enableTracing: false, initialNavigation: true, useHash: false })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
