import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { FormGroup } from "@angular/forms";

@Component({
  selector: "default-report-form",
  templateUrl: "./default-report-form.component.html",
  styleUrls: ["./default-report-form.component.scss"],
})
export class DefaultReportFormComponent implements OnInit {
  @Input() incidentForm: FormGroup;

  public healthAndSafety: boolean;

  constructor() {}

  ngOnInit() {
    this.subscribeToCategoryChanges();
  }

  private subscribeToCategoryChanges() {
    this.incidentForm.controls["incidentCategoryId"].valueChanges.subscribe(
      (categoryId) => {
        if (categoryId == 7) {
          this.healthAndSafety = true;
        } else {
          this.healthAndSafety = false;
        }
      }
    );
  }
}
