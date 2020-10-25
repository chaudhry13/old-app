import { TestBed, async } from "@angular/core/testing";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { RouterTestingModule } from "@angular/router/testing";
import { PlacesSearchService } from "./places-search.service";

declare var google: any;

describe("Places Search Service", () => {
  let placesService: PlacesSearchService;
  describe("Places Predictions", () => {
    beforeEach(async(() => {
      placesService = jasmine.createSpyObj("PlacesSearchService", [
        "getPlacesPredictions",
      ]);

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

    it("should initialize the service", () => {
      expect(placesService).toBeTruthy();
    });
  });
});
