import { Component, OnInit } from '@angular/core';
import { PlacesSearchService } from 'src/app/_services/places-search.service';

@Component({
  selector: 'location-searchbar',
  templateUrl: './location-searchbar.component.html',
  styleUrls: ['./location-searchbar.component.scss']
})
export class LocationSearchbarComponent implements OnInit {

  public autocompleteItems: any[];
  public query: string;

  constructor(public placesSearchService: PlacesSearchService) { }

  ngOnInit() {
  }

  updateSearch() {
    this.placesSearchService.getPlacesPredictions(this.query).then((predictions) => {
      this.autocompleteItems = predictions;
    }).catch((predictions => {
      this.autocompleteItems = predictions;
    }));
  }

}
