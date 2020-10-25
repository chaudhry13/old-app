import { Component, OnInit, EventEmitter } from "@angular/core";
import { ControlService } from "../../services/control.service";
import { Control } from "../../models/control";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Division } from "@app/models/division";
import { DivisionService } from "@app/services/division.service";
import {
  NavController,
  PopoverController,
  ModalController,
} from "@ionic/angular";
import { Keyboard } from "@ionic-native/keyboard/ngx";

@Component({
  selector: "app-audit-page",
  templateUrl: "audit.page.html",
  styleUrls: ["audit.page.scss"],
})
export class AuditPage implements OnInit {
  controls: Control[];
  divisions: Division[];

  public controlFilterForm: FormGroup;
  public setDivisions = new EventEmitter<string[]>();

  constructor(
    public controlService: ControlService,
    public navigationService: NavController,
    public divisionService: DivisionService,
    public formBuilder: FormBuilder,
    private keyboard: Keyboard
  ) {
    this.controlFilterForm = this.formBuilder.group({
      divisionIds: [""],
      responsibility: [""],
      active: [null],
      search: [""],
    });
    this.list();
  }

  onSearch() {
    this.keyboard.hide();
  }

  ngOnInit() {
    this.list();

    this.divisionService.list().then((divisions) => {
      this.divisions = divisions;
    });

    this.subscribeToControlFormChanges();
  }

  divisionsChanged(data) {
    if (data) {
      this.controlFilterForm.get("divisionIds").setValue(data);
    }
  }

  private subscribeToControlFormChanges() {
    this.controlFilterForm.valueChanges
      .pipe(debounceTime(250), distinctUntilChanged())
      .subscribe(() => {
        this.list();
      });
  }

  list() {
    if (this.controlFilterForm.valid) {
      this.controlService
        .list(this.controlFilterForm.value)
        .then((controls) => {
          this.controls = controls;
        });
    }
  }

  navigate(id: string) {
    this.navigationService.navigateForward("audits/" + id);
  }
}
