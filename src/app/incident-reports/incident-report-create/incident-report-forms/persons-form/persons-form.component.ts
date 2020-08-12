import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'persons-form',
  templateUrl: './persons-form.component.html',
  styleUrls: ['./persons-form.component.scss']
})
export class PersonsFormComponent implements OnInit {

  @Output() formChanges = new EventEmitter<FormArray>();

  constructor(private formBuilder: FormBuilder) { }

  personsForm: FormGroup;
  persons: FormArray;

  ngOnInit() {
    this.personsForm = this.formBuilder.group({
      persons: this.formBuilder.array([this.createPerson()])
    });

    this.personsForm.valueChanges.subscribe(form => {
      this.formChanges.emit(form);
    })
  }

  private createPerson(): FormGroup {
    return this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
    });
  }

  addPerson(): void {
    this.persons = this.personsForm.get('persons') as FormArray;
    this.persons.push(this.createPerson());
  }

  removePersonAtIndex(index: number) {
    this.persons = this.personsForm.get('persons') as FormArray;
    this.persons.removeAt(index);
  }

}
