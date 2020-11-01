import { TestBed, async } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule, ModalController } from "@ionic/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { LocationModalPage } from "./location-modal.page";
import { PlacesSearchService } from "@shared/services/places-search.service";

declare var google: any;

describe("Location Modal", () => {
  let locationModal: LocationModalPage;
  let placesService: PlacesSearchService;
  let modalController: ModalController;
  describe("Location Model Behaviour", () => {
    beforeEach(async(() => {
      modalController = jasmine.createSpyObj("ModalController", ["create"]);
      placesService = jasmine.createSpyObj("PlacesSearchService", [
        "getPlacesPredictions",
      ]);
      locationModal = new LocationModalPage(modalController, placesService);

      TestBed.configureTestingModule({
        declarations: [],
        imports: [
          CommonModule,
          FormsModule,
          ReactiveFormsModule,
          IonicModule,
          RouterTestingModule,
        ],
        providers: [],
      }).compileComponents();
    }));

    it("should initialize the modal", () => {
      expect(locationModal).toBeTruthy();
    });
  });
});
