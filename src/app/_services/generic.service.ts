export class GenericService {
  public apiBase = "https://test1api.humanrisks.com/api";
  public authBase = "https://test1auth.humanrisks.com/connect/token";

  constructor(extension: string = "") {
    this.apiBase = this.apiBase + extension;
  }
}