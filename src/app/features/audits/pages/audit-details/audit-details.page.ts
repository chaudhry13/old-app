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
import { Audit } from "../../models/audit";
import cronstrue from "cronstrue";
import { CommentService } from "@shared/services/comment.service";

@Component({
  selector: "app-audit-details",
  templateUrl: "./audit-details.page.html",
  styleUrls: ["./audit-details.page.scss"],
})
export class AuditDetailsPage implements OnInit {
  private id: string;

  public control: Control;

  public overdueAudits: Audit[];
  public upcomingAudits: Audit[];
  public completedAudits: Audit[];

  public files: Attachment[];

  public frequency: string;

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
    private commentSevice:CommentService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get("id");
  }

  ngOnInit() {
    // console.log("This is a comment");
    
    // this.commentSevice.list(this.id, 6).then(val=>{
    //   console.log(val);
      
    // })
  }

  ionViewWillEnter() {
    this.getAudits(); // To make sure audits are updated properly
  }

  getAudits() {
    this.controlService.get(this.id).then((control) => {
      this.control = control;
      this.frequency = cronstrue.toString(control.frequency); // TODO: Use CronService

      this.auditService.completed(control.id).then((audits) => {
        this.completedAudits = audits;
      });

      this.auditService.upcoming(control.id).then((audits) => {
        this.upcomingAudits = audits;
      });

      this.auditService.overdue(control.id, []).then((audits) => {
        this.overdueAudits = audits;
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
