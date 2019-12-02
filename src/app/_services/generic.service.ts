export class GenericService {
  public apiBase = "https://localhost:5000/api";
  public authBase = "https://https://localhost:5001/connect/token";

  constructor(extension: string = "") {
    this.apiBase = this.apiBase + extension;
  }
}