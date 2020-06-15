import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationModalPage } from './location-modal.page';

describe('ValidationService', () => {
    let locationModal: LocationModalPage;
    let modalController: ModalController;
    describe("Validation of questions", () => {
        beforeEach(async(() => {
            modalController = jasmine.createSpyObj('ModalController', ['create']);
            locationModal = new LocationModalPage(modalController);
            TestBed.configureTestingModule({
                declarations: [

                ],
                imports: [
                    CommonModule,
                    FormsModule,
                    ReactiveFormsModule,
                    IonicModule,
                    RouterTestingModule
                ],
                providers: [
                    { provide: LocationModalPage, useValue: locationModal },
                ],
            }).compileComponents();
        }));

        it('should initialize the modal', () => {
            expect(locationModal).toBeTruthy();
        });
    });
});