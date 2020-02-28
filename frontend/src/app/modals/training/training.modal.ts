import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { RecordEntity } from '@entities';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-training-modal',
  templateUrl: './training.modal.html',
  styleUrls: ['./training.modal.scss']
})
export class TrainingModalComponent implements OnInit, OnDestroy {
  // @ViewChild('visualizer', {static: true})
  // canvas: ElementRef<HTMLCanvasElement>;
  public records: RecordEntity[] = [...Array(3)].map(() => new RecordEntity());
  public currentPlaying: RecordEntity;
  public currentRecord: RecordEntity;
  private wakeWordUuid: string;
  private subscriptions: Subscription[] = [];
  // private visualizerContext: CanvasRenderingContext2D;
  // private visualizerAnimation: number;
  // private analyserNode: AnalyserNode;

  constructor(private activatedRoute: ActivatedRoute) {
  }

  public onStartRecord(record, $event: MediaStream) {
    this.currentRecord = record;
    // this.prepareVisualizer($event);
    // this.startVisualizer();
  }

  public onStopRecord(record) {
    this.currentRecord = null;
    // this.stopVisualizer();
  }

  public onStartPlaying(record, $event: MediaStream) {
    this.currentPlaying = record;
    // this.prepareVisualizer($event);
    // this.startVisualizer(3);
  }

  public onStopPlaying(record) {
    this.currentPlaying = null;
    // this.stopVisualizer();
  }

  public ngOnInit(): void {
    this.subscriptions.push(this.activatedRoute.params.subscribe((params: Params) => {
      this.wakeWordUuid = params.wakeWordUuid;
    }));
    // this.visualizerContext = this.canvas.nativeElement.getContext('2d');
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
  }

  public areAllFilled() {
    return !this.records.find(r => !r.blob);
  }

  public areAllSent() {
    return !this.records.find(r => !r.uploadStatus);
  }

  public uploadRecords() {
    for (const record of this.records) {
      record.uploadStatus = 'upload';
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append('file', record.blob, 'capture.wav');
      fd.append('wake_word_uuid', this.wakeWordUuid);
      xhr.open('POST', '/api/record/upload', true);
      // xhr.setRequestHeader('Content-Type', 'audio/wav');
      ['loadstart', 'progress', 'load', 'loadend'].forEach((eventType: string) => {
        xhr.upload.addEventListener(eventType, this.handleUploadProgress.bind(this, record, xhr));
      });
      ['error', 'abort'].forEach((eventType: string) => {
        xhr.upload.addEventListener(eventType, this.handleUploadError.bind(this, record));
      });
      ['loadstart', 'progress', 'load', 'loadend'].forEach((eventType: string) => {
        xhr.addEventListener(eventType, this.handleUploadProgress.bind(this, record, xhr));
      });
      ['error', 'abort', 'timeout'].forEach((eventType: string) => {
        xhr.addEventListener(eventType, this.handleUploadError.bind(this, record));
      });
      xhr.send(fd);
    }
  }

  /*private prepareVisualizer(stream: MediaStream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 128;
    source.connect(this.analyserNode);
  }

  private startVisualizer(reduceFactor?: number) {
    let frequencyBinCount = this.analyserNode.frequencyBinCount;
    if (reduceFactor) {
      frequencyBinCount = frequencyBinCount / reduceFactor;
    }

    this.visualizerAnimation = requestAnimationFrame(this.startVisualizer.bind(this, reduceFactor));
    const soundDataArray = new Uint8Array(frequencyBinCount);
    this.analyserNode.getByteFrequencyData(soundDataArray);

    this.visualizerContext.fillStyle = 'rgb(255, 255, 255)';
    this.visualizerContext.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const barWidth = (this.canvas.nativeElement.width / frequencyBinCount);
    let offsetLeft = 0;
    // const bars = this.bars.toArray();

    soundDataArray.forEach((barHeight: number, idx: number) => {
      // const scale = ((barHeight / 255) + 1);
      // bars[idx].nativeElement.style.transform = 'scale3d(' + scale + ', ' + scale + ', 1)';
      this.visualizerContext.fillStyle = 'rgb(50,50,' + (barHeight + 100) + ')';
      this.visualizerContext.fillRect(
        offsetLeft,
        this.canvas.nativeElement.height - barHeight,
        barWidth,
        barHeight);

      offsetLeft += barWidth + 1;
    });
  }

  private stopVisualizer() {
    if (this.visualizerAnimation) {
      cancelAnimationFrame(this.visualizerAnimation);
    }
    this.visualizerContext.clearRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
  }*/

  private handleUploadProgress(record: RecordEntity, xhr: XMLHttpRequest, event: ProgressEvent) {
    if (xhr.status && xhr.status !== 200) {
      return this.handleUploadError(record, event);
    }
    // upload
    if (event.lengthComputable) {
      console.log('Upload', event.type, record, event);
      switch (event.type) {
        case 'loadstart':
        case 'progress':
          record.uploadStatus = 'upload';
          record.uploadPercent = event.loaded / event.total * 100;
          break;
        case 'load':
          record.uploadPercent = 100;
          record.uploadStatus = 'download';
          break;
      }
    }
    // download
    switch (event.type) {
      case 'load':
        console.log('Download', event.type, record, event);
        record.uploadStatus = 'done';
        break;
    }
  }

  private handleUploadError(record: RecordEntity, event: ProgressEvent) {
    console.log('Error', event.type, event);
    record.uploadStatus = 'error';
  }
}
