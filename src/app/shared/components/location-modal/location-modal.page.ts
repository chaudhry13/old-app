import {
  Component,
  Input,
  OnInit,
  NgZone,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
} from "@angular/core";
import { NavParams, ModalController } from "@ionic/angular";
import { PlacesSearchService } from "@shared/services/places-search.service";

declare var google: any;

@Component({
  selector: "location-modal-page",
  templateUrl: "./location-modal.page.html",
})
export class LocationModalPage implements OnInit {
  autocompleteItems: any[];
  autocomplete: any;
  acService: any;
  placesService: any;
  query: string;

  constructor(
    public modalController: ModalController,
    public placesSearchService: PlacesSearchService
  ) {
    this.autocompleteItems = [];
    this.autocomplete = {};
  }

  ngOnInit() { }

  ionViewWillEnter() {
    this.acService = new google.maps.places.AutocompleteService();
    this.updateSearch();
  }

  dismiss() {
    this.modalController.dismiss();
  }

  chooseItem(item: any) {
    this.modalController.dismiss(item.description);
  }

  updateSearch() {
    this.placesSearchService
      .getPlacesPredictions(this.query)
      .then((predictions) => {
        this.autocompleteItems = predictions;
      })
      .catch((predictions) => {
        this.autocompleteItems = predictions;
      });
  }
}
