export class RecordEntity {
  public inProgress = false;
  public isPlaying = false;
  public uploadStatus = null;
  public uploadPercent = 0;
  public blob: Blob;

  constructor() {
  }

  public reset() {
    this.inProgress = false;
    this.isPlaying = false;
    this.uploadStatus = null;
    this.uploadPercent = 0;
    delete this.blob;
  }
}
