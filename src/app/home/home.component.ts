import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  form: FormGroup;
  constructor(private fb: FormBuilder) {
    this.form = fb.group({
      orgName: ["", Validators.required],
    });
  }

  ngOnInit() {}

  onSubmit($event: Event) {
    $event.preventDefault();

    this.setApplicationConfig(this.form.get("orgName").value);
  }

  setApplicationConfig(orgName: string) {
    alert(orgName);
  }
}
