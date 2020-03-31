import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ControlService } from 'src/app/_services/control.service';
import { Control } from 'src/app/_models/control';
import { StorageService } from 'src/app/_services/storage.service';
import { Attachment } from 'src/app/_models/file';
import { Platform } from '@ionic/angular';
import { File } from '@ionic-native/file/ngx';
import { FileOpener } from '@ionic-native/file-opener/ngx';
import { DocumentViewer } from '@ionic-native/document-viewer/ngx';
import { FileTransfer } from '@ionic-native/file-transfer/ngx';
import { AuditService } from 'src/app/_services/audit.service';
import { Audit } from 'src/app/_models/audit';
import cronstrue from 'cronstrue';


@Component({
  selector: 'app-audit-details',
  templateUrl: './audit-details.page.html',
  styleUrls: ['./audit-details.page.scss'],
})
export class AuditDetailsPage implements OnInit {

  private id: string;

  public control: Control;

  public overdueAudits: Audit[];
  public upcomingAudits: Audit[];
  public completedAudits: Audit[];

  public files: Attachment[];

  public frequency: string;

  constructor(public activatedRoute: ActivatedRoute, private controlService: ControlService, private auditService: AuditService, private storageService: StorageService, private platform: Platform, private file: File, private ft: FileTransfer,
    private fileOpener: FileOpener, private document: DocumentViewer) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getAudits();
  }

  ionViewWillEnter() {
    this.getAudits(); // TODO: Should not be loaded twice.
  }

  getAudits() {
    this.controlService.get(this.id).then(control => {
      this.control = control;
      this.frequency = cronstrue.toString(control.frequency);

      this.auditService.completed(control.id).then(audits => {
        this.completedAudits = audits;
      });

      this.auditService.upcoming(control.id).then(audits => {
        this.upcomingAudits = audits;
      });

      this.auditService.overdue(control.id, []).then(audits => {
        this.overdueAudits = audits;
      });

      this.storageService.listControl(control.id).then(files => {
        this.files = files;
      });
    });
  }

  downloadAndOpen(attachement: Attachment) {
    let downloadUrl = attachement.url;

    let path = this.file.dataDirectory;

    const transfer = this.ft.create();

    transfer.download(downloadUrl, path + attachement.name, true).then(entry => {
      let url = entry.toURL();

      if (this.platform.is('ios')) {
        this.document.viewDocument(url, 'application/pdf', {});
      } else {
        this.fileOpener.open(url, 'application/pdf')
          .then(() => console.log('File is opened'))
          .catch(e => console.log('Error opening file', e));
      }
    });
  }
}
