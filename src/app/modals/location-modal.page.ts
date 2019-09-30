import { Component, Input, OnInit } from '@angular/core';
import { NavParams, ModalController } from '@ionic/angular';

declare var google: any;

@Component({
  selector: 'location-modal-page',
  templateUrl: './location-modal.page.html'
})
export class LocationModalPage implements OnInit {

  autocompleteItems: any;
  autocomplete: any;
  acService: any;
  placesService: any;
  query: string;

  constructor(public modalController: ModalController) {

  }

  ngOnInit() {
    this.acService = google.maps.places.AutocompleteService();
    this.autocompleteItems = [];
    this.autocomplete = {
    };
  }

  dismiss() {
    this.modalController.dismiss();
  }

  chooseItem(item: any) {
    this.modalController.dismiss(item.description);
  }

  updateSearch() {
    if (this.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let self = this;

    let config = {
      types: ['geocode'],
      input: this.query
    }

    this.acService.getPlacePredictions(config, function (predictions, status) {
      self.autocompleteItems = [];
      predictions.forEach(function (prediction) {
        self.autocompleteItems.push(prediction);
      });
    });
  }

}