import { Component, OnInit } from "@angular/core";
import { ControlService } from "../_services/control.service";
import { Control } from "../_models/control";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Division } from "../_models/division";
import { DivisionService } from "../_services/division.service";
import { NavController } from '@ionic/angular';

@Component({
  selector: "app-audit-page",
  templateUrl: "audit.page.html",
  styleUrls: ["audit.page.scss"]
})
export class AuditPage implements OnInit {
  controls: Control[];
  divisions: Division[];

  public controlFilterForm: FormGroup;

  constructor(public controlService: ControlService, public navigationService: NavController, public divisionService: DivisionService, public formBuilder: FormBuilder) {
    this.controlFilterForm = this.formBuilder.group({
      divisionIds: [""],
      responsibility: [""],
      active: [null],
      search: [""]
    });
    this.list();
  }

  ngOnInit() {
    this.list();

    this.divisionService.list().then(divisions => {
      this.divisions = divisions;
    });

    this.controlFilterForm.valueChanges
      .pipe(
        debounceTime(250),
        distinctUntilChanged()
      )
      .subscribe(() => {
        this.list();
      });
  }

  list() {
    this.controls = [];
    this.controlService.list(this.controlFilterForm.value).then(controls => {
      this.controls = controls;
      controls.forEach(c => console.log(c.title));
    });
  }

  navigate(id: string) {
    this.navigationService.navigateForward('audits/' + id);
  }
}
