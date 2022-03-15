import { Injectable } from "@angular/core";
import { Router, UrlTree, UrlSegmentGroup } from "@angular/router";
import { AuditService } from "../../features/audits/services/audit.service";
import { IncidentReportService } from "@app/services/incident-report.service";

@Injectable()
export class DeeplinkService {
  constructor(
    private router: Router,
    private auditService: AuditService,
    private incidentReportService: IncidentReportService
  ) {}

  async handleLink(link: string) {
    let path: string[];
    let url: URL;

    return new Promise<void>((resolve, reject) => {
      if (!link || link === "" || link.length === 0) {
        reject();
      } else {
        url = new URL(link);
      }
      if (url.pathname.includes("/audits/")) {
        path = url.pathname.split("/");
        this.auditService
          .get(path[2])
          .then(() => {
            this.router.navigate(["tabs/tab1/details/" + path[2]], {
              replaceUrl: true,
            });
            resolve();
          })
          .catch(() => {
            reject();
          });
      } else if (url.pathname.includes("/incident-reports/")) {
        path = url.pathname.split("/");
        this.incidentReportService
          .get(path[2], +path[3])
          .then(() => {
            this.router.navigate(
              ["tabs/tab2/details/" + path[2] + "/" + path[3]],
              { replaceUrl: true }
            );
            resolve();
          })
          .catch(() => {
            reject();
          });
      } else {
        reject();
      }
    });
  }
}
