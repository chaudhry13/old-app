import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ControlService } from "../../services/control.service";
import { Control } from "../../models/control";
import { StorageService } from "@app/services/storage.service";
import { Attachment } from "@app/models/file";
import { Platform } from "@ionic/angular";
import {File, FileEntry, IFile} from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { AuditService } from "../../services/audit.service";
import { Audit, AuditStatus } from "../../models/audit";
import cronstrue from "cronstrue";
import { CommentService } from "@app/services/comment.service";
import { User } from "@app/models/user";
import { AuthService } from "src/app/auth/auth.service";
import {HTTP} from "@ionic-native/http/ngx";
import {ToastService} from "@app/services/toast.service";

@Component({
  selector: "app-audit-details",
  templateUrl: "./audit-details.page.html",
  styleUrls: ["./audit-details.page.scss"],
})
export class AuditDetailsPage implements OnInit {
  private id: string;

  public control: Control;

  public overdueAudits: Audit[];
  public startedAudits: Audit[];
  public upcomingAudits: Audit[];
  public completedAudits: Audit[];

  public files: Attachment[];

  public frequency: string;
  public user: User;

  constructor(
    public activatedRoute: ActivatedRoute,
    private controlService: ControlService,
    private auditService: AuditService,
    private storageService: StorageService,
    private platform: Platform,
    private file: File,
    private http: HTTP,
    public toastService: ToastService,
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    private commentSevice: CommentService,
    private auth: AuthService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.user = this.auth.user;

    this.auth.user$.subscribe((user) => {
        this.user = user;
    });
  }

  ionViewWillEnter() {
    this.getAudits(); // To make sure audits are updated properly
  }

  getAudits() {
    this.controlService.get(this.id).then((control) => {
      this.control = control;

      if (control.frequency) {
        this.frequency = cronstrue.toString(control.frequency); // TODO: Use CronService
      }

      let auditFilter = {
        controlId: this.id,
        status: null,
        current: null,
        version: null,
        startDate: null,
        endDate: null,
      };
      this.auditService.list(auditFilter).then((response) => {
        // Setting the audits
        this.completedAudits = response
          .filter((a) => a.status == AuditStatus.Completed)
          .sort((a, b) => {
            return a.date > b.date ? -1 : 1;
          });
        this.overdueAudits = response.filter(
          (a) => a.late && a.status == AuditStatus.Upcoming
        );
        this.startedAudits = response.filter(
          (a) =>
            a.status == AuditStatus.Rejected ||
            a.status == AuditStatus["Awaiting Approvel"]
        );
        this.upcomingAudits = response.filter(
          (a) => a.status == AuditStatus.Upcoming && !a.late
        );
      });

      this.storageService.listControl(control.id).then((files) => {
        this.files = files;
      });
    });
  }

  async downloadAndOpen(attachment: Attachment){
    var url = attachment.url;

    const path = (this.platform.is("ios") ?
        this.file.documentsDirectory :
        this.file.dataDirectory) +  attachment.name;

    const fileEntry = await this.http.downloadFile(url, {}, {}, path);

    fileEntry.file(success => {
      this.fileOpener
          .open(fileEntry.nativeURL, success.type)
          .then(() => console.debug("File is opened"))
          .catch((e) => {
            this.toastService.show("Error opening file", "danger");
            console.error("Error opening file (fileOpener.open)", e)}
          );
    }, error => {
      this.toastService.show("Error opening file", "danger");
      console.log("Error opening file (fileEntry.file)", error)
    })

  }
}
