import { Component, OnInit, ViewChild, ElementRef, Input } from '@angular/core';
import { Audit } from '../../_models/audit';
import { Alert } from 'selenium-webdriver';
import { OAuthService } from 'angular-oauth2-oidc';
import { Router, ActivatedRoute } from '@angular/router';
import { LoadingController, AlertController, NavParams } from '@ionic/angular';
import { AuditService } from 'src/app/_services/audit.service';
import { CameraService } from 'src/app/_services/photo.service';
import { MapService } from 'src/app/_services/maps.service';
import { ToastService } from 'src/app/_services/toast.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ControlService } from 'src/app/_services/control.service';

@Component({
    selector: 'app-audit-complete',
    templateUrl: 'audit-complete.page.html'
})

export class AuditCompletePage implements OnInit {
    @ViewChild("map") mapRef: ElementRef;

    @Input()
    id: string;

	audit: Audit = new Audit();

	auditForm: FormGroup;

	photo: string;
    photos: any = [];
    
    uploadProgress: number = 0;
	uploadAlert: Alert;

	// id: string;
	// controlId: string;
	// title: string;
	// description: string;
	// date: string;
	// remarks?: string;
	// other?: string;
	// followUp: boolean;
	// followUpId: string;
	// late: boolean;
	// completed: boolean;
	// completedAt: Date;
	// location: boolean;
	// latitude: number;
	// longitude: number;
	// files: Attachment[];
	
    constructor(
        public oauthService: OAuthService,
        public router: Router,
		public activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		public loadingCtrl: LoadingController,
		public alertCtrl: AlertController,
		public auditService: AuditService,
		public controlService: ControlService,
		public mapService: MapService,
		public cameraService: CameraService,
		public toastService: ToastService,
		public geolocation: Geolocation
    ) {
        this.id = this.activatedRoute.snapshot.paramMap.get('id');
		this.getAudit();
		
		this.auditForm = this.formBuilder.group({
			id: ["", Validators.required],
			description: ["", Validators.required],
			other: [""],
			nearMiss: [false],
			divisionIds: [null, Validators.required],
			address: [""],
			city: [""],
			startDate: [new Date().toISOString(), Validators.required],
			endDate: [new Date().toISOString(), Validators.required],
			latitude: ["", Validators.required],
			longitude: ["", Validators.required],
			incidentTypeId: [null, Validators.required],
			incidentCategoryId: [null, Validators.required],
			countryId: [""],
		  });

    }

    ngOnInit() { }

    getAudit() {
		this.auditService.get(this.id).then(
			data => {
				this.audit = data;

				// this.showMap();
			},
			error => {
				this.toastService.show("An error occurred retrieving the audit..");
			}
		);
	}

	// updateAudit(toast: boolean) {


	// 	this.auditService.update(null).then(
	// 		data => {
	// 			this.audit.remarks = data.remarks;
	// 			this.audit.other = data.other;
	// 			this.audit.followUp = data.followUp;
	// 			this.audit.completed = data.completed;

	// 			if (toast) {
	// 				this.toastService.show("Audit updated successfully");
	// 			}
	// 		},
	// 		error => {
	// 			this.toastService.show("An error occurred updating the audit");
	// 		}
	// 	);
	// }
    
    // showMap() {
	// 	this.mapService.init(
	// 		this.audit.latitude,
	// 		this.audit.longitude,
	// 		this.mapRef,
	// 		true
	// 	);
	// }

}