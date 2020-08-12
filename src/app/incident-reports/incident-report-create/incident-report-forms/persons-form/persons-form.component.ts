import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { Person } from 'src/app/_models/persons';

@Component({
  selector: 'persons-form',
  templateUrl: './persons-form.component.html',
  styleUrls: ['./persons-form.component.scss']
})
export class PersonsFormComponent implements OnInit {

  constructor(private formBuilder: FormBuilder) { }

  personsForm: FormGroup;
  persons: FormArray;

  ngOnInit() {
    this.personsForm = this.formBuilder.group({
      persons: this.formBuilder.array([this.createPerson()])
    });

    this.personsForm.valueChanges.subscribe(form => {
      console.log(form);
    })
  }

  private createPerson(): FormGroup {
    return this.formBuilder.group({
      name: '',
      email: '',
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
