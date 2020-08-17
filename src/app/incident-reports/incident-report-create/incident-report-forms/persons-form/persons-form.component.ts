import { Component, OnInit, EventEmitter, Output, Input, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { IonContent } from '@ionic/angular';

@Component({
  selector: 'persons-form',
  templateUrl: './persons-form.component.html',
  styleUrls: ['./persons-form.component.scss']
})
export class PersonsFormComponent implements OnInit {

  @Output() formChanges = new EventEmitter<FormArray>();
  @Input() isDetailed: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private elRef: ElementRef) { }

  personsForm: FormGroup;
  persons: FormArray;
  personsShown: PersonsViewModel[] = [];

  ngOnInit() {
    this.personsForm = this.formBuilder.group({
      persons: this.formBuilder.array([])
    });

    this.addPerson();

    this.personsForm.valueChanges.subscribe(form => {
      this.formChanges.emit(this.persons);
    })
  }

  private createPerson(): FormGroup {
    return this.formBuilder.group({
      name: [{ value: '', disabled: false }],
      email: [{ value: '', disabled: this.isDetailed }],
      gender: [{ value: null, disabled: !this.isDetailed }],
      approxAge: [{ value: '', disabled: !this.isDetailed }],
      height: [{ value: '', disabled: !this.isDetailed }],
      build: [{ value: null, disabled: !this.isDetailed }],
      identifyingfeatures: [{ value: '', disabled: !this.isDetailed }],
      clothes: [{ value: '', disabled: !this.isDetailed }],
    });
  }

  addPerson(): void {
    this.persons = this.personsForm.get('persons') as FormArray;
    this.persons.push(this.createPerson());
    this.personsShown.forEach(p => p.shown = false);
    this.personsShown.push({ index: this.persons.length - 1, shown: true });
    this.formChanges.emit(this.persons);
    this.scrollToBeginning();
  }

  private scrollToBeginning() {
    this.elRef.nativeElement.closest(".content").scrollToPoint(0, 1000, 1); // 1000 is a magic number..
  }

  removePersonAtIndex(index: number) {
    if (index <= 0) return;
    this.persons = this.personsForm.get('persons') as FormArray;
    this.persons.removeAt(index);
    this.personsShown.splice(index, 1);
  }

  toggleShowOfIndex(index: number) {
    this.personsShown[index].shown = !this.personsShown[index].shown;
  }

}

export class PersonsViewModel {
  index: number;
  shown: boolean = true;
}