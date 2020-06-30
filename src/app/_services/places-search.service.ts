import { Injectable } from '@angular/core';

declare var google: any;

@Injectable()
export class PlacesSearchService {
    placesService: any;

    constructor() {
        this.placesService = new google.maps.places.AutocompleteService();
    }

    async getPlacesPredictions(query: string): Promise<any[]> {
        return new Promise((resolve, reject) => {
            if (!query || query == '' || query == "") {
                resolve([]);
            } else {
                let config = {
                    types: ['geocode'],
                    input: query
                }

                this.placesService.getPlacePredictions(config, (predictions, status) => {
                    if (status != google.maps.places.PlacesServiceStatus.OK) {
                        resolve([]);
                    }
                    resolve(predictions);
                });
            }
        });
    }



}