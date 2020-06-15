import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { LocationModalPage } from './location-modal.page';

declare var google: any;

describe('Location Modal', () => {
    let locationModal: LocationModalPage;
    let modalController: ModalController;
    let acService: google.maps.places.AutocompleteService;
    describe("Autocompletion", () => {
        beforeEach(async(() => {
            modalController = jasmine.createSpyObj('ModalController', ['create']);
            locationModal = new LocationModalPage(modalController);
            acService = jasmine.createSpyObj('google.maps.places.AutocompleteService', ['getPlacePredictions']);
            locationModal.acService = acService;

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
                ],
            }).compileComponents();
        }));

        it('should initialize the modal', () => {
            expect(locationModal).toBeTruthy();
        });

        it('should not call getPlacePredictions on empty search string', () => {
            locationModal.query = "";
            locationModal.updateSearch();
            expect(acService.getPlacePredictions).toHaveBeenCalledTimes(0);
            expect(locationModal.autocompleteItems.length).toBe(0);
        });

        it('should call getPlacePredictions with non-empty search query', () => {
            locationModal.query = "a";
            locationModal.updateSearch();
            expect(acService.getPlacePredictions).toHaveBeenCalledTimes(1);
        });
    });
});