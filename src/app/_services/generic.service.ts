export class GenericService {
  public apiBase = "https://humanrisks-core-api.azurewebsites.net/api";
  public authBase = "https://localhost:5001/connect/token";

  constructor(extension: string = "") {
    this.apiBase = this.apiBase + extension;
  }
}
