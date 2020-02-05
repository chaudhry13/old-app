import { Injectable } from '@angular/core';
import { Router, UrlTree, UrlSegmentGroup } from '@angular/router';

@Injectable()
export class DeeplinkService {
  constructor(private router: Router) { }

  async handleLink(link: string) {
    var path: String[];

    return new Promise<any>((resolve, reject) => {
      if (!link || link == "" || link.length === 0)
        reject();
      else
        var url = new URL(link);
      if (url.pathname.includes("/audits/")) {
        path = url.pathname.split("/");
        this.router.navigate(["tabs/tab1/details/" + path[2]], { replaceUrl: true });
        resolve();
      } else if (url.pathname.includes("/incident-reports/")) {
        path = url.pathname.split("/");
        this.router.navigate(["tabs/tab2/details/" + path[2] + "/" + path[3]], { replaceUrl: true });
        resolve();
      } else {
        reject();
      }
    });
  }

}