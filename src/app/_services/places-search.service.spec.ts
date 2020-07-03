import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TestBed, async } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterTestingModule } from '@angular/router/testing';
import {PlacesSearchService} from './places-search.service';
import {promptToSignup} from '@ionic/cli/lib/session';

declare var google: any;

describe('Places Search Service', () => {
    let placesService: PlacesSearchService;
    describe('Places Predictions', () => {
        beforeEach(async(() => {
            placesService = jasmine.createSpyObj('PlacesSearchService', ['getPlacesPredictions']);

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

        it('should initialize the service', () => {
            expect(placesService).toBeTruthy();
        });

        it('should reject getPlacePredictions on empty search string', (done) => {
            const promise = placesService.getPlacesPredictions('');
            promise.then(predictions => {
                throw new Error('Should not resolve!');
            }).catch(predictions => {
                done();
            });
            expect(placesService.getPlacesPredictions).toHaveBeenCalledTimes(1);
        });

        it('should call getPlacePredictions with non-empty search query', () => {
            placesService.getPlacesPredictions('a');
            expect(placesService.getPlacesPredictions).toHaveBeenCalledTimes(1);
        });
    });
});
