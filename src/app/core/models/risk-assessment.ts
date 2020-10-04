import { Division } from "./division";
import { Asset } from "./asset";
import { Country } from "@shared/models/country";
import { User, UserList } from "./user";
import { SiteCategory } from "./sitecategory";

export class RiskAssessmentList {
  id: string;
  title: string;
  status: boolean;
  country: Country;
  latitude: number;
  longitude: number;
  owner: UserList;
  siteCategory: string;
  asset: Asset;
}

export class RiskAssessment {
  id: string;
  title: string;
  owner: User;
  address: string;
  country: Country;
  latitude: number;
  longitude: number;
  asset: Asset;
  siteCategory: any;
  divisions: Division[];
  status: boolean;
  startDate: string;
  endDate: string;
  reviewDate: string;
  remarks: string;
  conclusion: string;
  incidentFilterId: string;
}

export class RiskAssessmentListFilter {
  divisions: string[] = new Array();
  search: string;
  assetIds: string[] = new Array();
  siteCategories: number[] = new Array();
  countryIds: number[] = new Array();
  pageSize: number;
  pageNumber: number;

  constructor(
    divisions: string[],
    search: string,
    assets: string[],
    siteCategories: number[],
    countries: number[],
    pageSize: number,
    pageNumber: number
  ) {
    if (divisions != undefined) {
      divisions.forEach(division => {
        this.divisions.push(division);
      });
    }

    if (assets != undefined) {
      assets.forEach(asset => {
        this.assetIds.push(asset);
      });
    }

    if (countries != undefined) {
      countries.forEach(country => {
        this.countryIds.push(country);
      });
    }

    if (siteCategories != undefined) {
      siteCategories.forEach(siteCategory => {
        this.siteCategories.push(siteCategory);
      });
    }

    this.search = search;
    this.pageSize = pageSize;
    this.pageNumber = pageNumber;
  }
}
