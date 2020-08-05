import { Component, OnInit } from "@angular/core";
import { ControlService } from "../_services/control.service";
import { Control } from "../_models/control";
import { FormBuilder, FormGroup } from "@angular/forms";
import { debounceTime, distinctUntilChanged } from "rxjs/operators";
import { Division } from "../_models/division";
import { DivisionService } from "../_services/division.service";
import { NavController, PopoverController, ModalController } from '@ionic/angular';
import { Keyboard } from '@ionic-native/keyboard/ngx';
import { DivisionSelectorComponent } from '../_shared/division-selector/division-selector.component';

@Component({
  selector: "app-audit-page",
  templateUrl: "audit.page.html",
  styleUrls: ["audit.page.scss"]
})
export class AuditPage implements OnInit {
  controls: Control[];
  divisions: Division[];

  public controlFilterForm: FormGroup;

  constructor(public controlService: ControlService,
    public navigationService: NavController,
    public divisionService: DivisionService,
    public formBuilder: FormBuilder,
    private keyboard: Keyboard,
    private modalController: ModalController) {
    this.controlFilterForm = this.formBuilder.group({
      divisionIds: [""],
      responsibility: [""],
      active: [null],
      search: [""]
    });
    this.list();
  }

  onSearch() {
    this.keyboard.hide();
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
    this.controlService.list(this.controlFilterForm.value).then(controls => {
      this.controls = controls;
    });
  }

  navigate(id: string) {
    this.navigationService.navigateForward('audits/' + id);
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: DivisionSelectorComponent,
      cssClass: 'division-selector-modal',
      componentProps: {
        'form': this.controlFilterForm
      }
    });
    await modal.present();
    const { data } = await modal.onWillDismiss();
    console.log("from dismiss")
    console.log(data);
    this.controlFilterForm.controls.divisionIds.setValue(data);
  }
}
