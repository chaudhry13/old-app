import { Component, Input, OnInit, NgZone, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
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
  showList: boolean;

  constructor(public modalController: ModalController) { }

  ngOnInit() {
    this.autocompleteItems = [];
    this.autocomplete = {};
  }

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
    this.showList = false;
    if (!this.query || this.query == '') {
      this.autocompleteItems = [];
      return;
    }

    let config = {
      types: ['geocode'],
      input: this.query
    }

    this.acService.getPlacePredictions(config, (predictions, status) => {
      if (status != google.maps.places.PlacesServiceStatus.OK) {
        return;
      }
      this.autocompleteItems = predictions;
    });

    setTimeout(() => {
      this.showList = true;
    }, 100);
  }

}