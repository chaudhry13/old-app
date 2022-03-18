import { enableProdMode } from "@angular/core";
import { platformBrowserDynamic } from "@angular/platform-browser-dynamic";

import { AppModule } from "./app/app.module";
import { environment } from "./environments/environment";

console.log('This is the main!');

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(AppModule)
  .catch((err) => {
    const errorMsgElement = document.querySelector("#errorMsgElement");
    let message = "Application initialization failed";
    if (err) {
      if (err.message) {
        message = message + ": " + err.message;
      } else {
        message = message + ": " + err;
      }
    }
    errorMsgElement.textContent =
      "Failed to start the app. Make sure you have an internet connection, and try again!";
    console.log(err);

    const reloadButton: HTMLHtmlElement = document.querySelector("#but");
    reloadButton.style.visibility = "visible";
    reloadButton.addEventListener("click", () => {
      location.reload();
    });

    if (errorMsgElement.textContent.length === 0) {
      reloadButton.remove();
    }
  });
