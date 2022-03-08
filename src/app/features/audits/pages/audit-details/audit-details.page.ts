import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { ControlService } from "../../services/control.service";
import { Control } from "../../models/control";
import { StorageService } from "@app/services/storage.service";
import { Attachment } from "@app/models/file";
import { Platform } from "@ionic/angular";
import { File } from "@ionic-native/file/ngx";
import { FileOpener } from "@ionic-native/file-opener/ngx";
import { DocumentViewer } from "@ionic-native/document-viewer/ngx";
import { FileTransfer } from "@ionic-native/file-transfer/ngx";
import { AuditService } from "../../services/audit.service";
import { Audit, AuditStatus } from "../../models/audit";
import cronstrue from "cronstrue";
import { CommentService } from "@shared/services/comment.service";
import { SettingsService } from "@app/settings/settings.component";
import { AuthService } from "@app/services/auth.service";
import { TokenService } from "@app/services/token.service";
import { User } from "@app/models/user";

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
    private ft: FileTransfer, // TODO: Fix this warning:
    // FileTransfer is deprecated
    private fileOpener: FileOpener,
    private document: DocumentViewer,
    private commentSevice:CommentService,
    private auth: AuthService,
    private tokenService: TokenService,
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    this.tokenService.readToken(this.auth.oAuth.getAccessToken());
    this.user = this.tokenService.getUser();
    // console.log("This is a comment");
    
    // this.commentSevice.list(this.id, 6).then(val=>{
    //   console.log(val);
      
    // })
  }

  ionViewWillEnter() {
    console.log('this is a test');
    this.getAudits(); // To make sure audits are updated properly
  }

  getAudits() {
    this.controlService.get(this.id).then((control) => {
      console.log(control);
      this.control = control;
      console.log('test3');
      
      if (control.frequency) {
        this.frequency = cronstrue.toString(control.frequency); // TODO: Use CronService
      }
      
      console.log('test1');
      let auditFilter = {
        controlId: this.id,
        status: null,
        current: null,
        version: null,
        startDate: null,
        endDate: null
      };
      console.log('test2');
      this.auditService.list(auditFilter).then(response => {
        console.log('Loaded audits:', response);
        // Setting the audits
        this.completedAudits = response.filter(a => a.status == AuditStatus.Completed).sort((a, b) => {
          return a.date > b.date ? -1 : 1;
        });
        this.overdueAudits = response.filter(a => a.late && a.status == AuditStatus.Upcoming);
        this.startedAudits = response.filter(a => a.status == AuditStatus.Rejected || a.status == AuditStatus["Awaiting Approvel"]);
        this.upcomingAudits = response.filter(a => a.status == AuditStatus.Upcoming && !a.late);
      });

      this.storageService.listControl(control.id).then((files) => {
        this.files = files;
      });
    });
  }

  downloadAndOpen(attachment: Attachment) {
    const downloadUrl = attachment.url;

    const path = this.file.dataDirectory;

    const transfer = this.ft.create();

    transfer
      .download(downloadUrl, path + attachment.name, true)
      .then((entry) => {
        const url = entry.toURL();

        if (this.platform.is("ios")) {
          this.document.viewDocument(url, "application/pdf", {});
        } else {
          this.fileOpener
            .open(url, "application/pdf")
            .then(() => console.debug("File is opened"))
            .catch((e) => console.error("Error opening file", e));
        }
      });
  }
}
