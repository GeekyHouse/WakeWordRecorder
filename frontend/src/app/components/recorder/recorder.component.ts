import { Component, ElementRef, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { PopInConfig } from '@modules/pop-in/config/pop-in.config';
import { PopInRef } from '@modules/pop-in/references/pop-in.reference';
import * as RecordRTC from 'recordrtc';

class Record {
  public inProgress = false;
  public isPlaying = false;
  public uploadStatus = null;
  public uploadPercent = 0;
  public blob: Blob;
}

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnInit, OnDestroy {

  @ViewChild('visualizer', {static: true})
  canvas: ElementRef<HTMLCanvasElement>;

  @ViewChildren('bar')
  bars: QueryList<ElementRef<HTMLDivElement>>;

  public currentRecord: Record;
  public records: Record[] = [...Array(3)].map(() => new Record());
  public currentPlaying: Record;
  private recorder: RecordRTC;
  private analyserNode: AnalyserNode;
  private visualizerContext: CanvasRenderingContext2D;
  private visualizerAnimation: number;
  private audioElement: HTMLAudioElement;

  constructor(public config: PopInConfig, public popInRef: PopInRef) {
    console.log('RECORDS', this.records);
  }

  public ngOnInit(): void {
    this.visualizerContext = this.canvas.nativeElement.getContext('2d');
  }

  public ngOnDestroy(): void {
    this.stopVisualizer();
    // this.cancelRecord()
  }

  public onClose(): void {
    this.popInRef.close('some value');
  }

  public areAllFilled() {
    return !this.records.find(r => !r.blob);
  }

  public startRecord(record) {
    record.inProgress = true;
    this.currentRecord = record;
    this.captureMicrophone((microphone) => {
      this.prepareVisualizer(microphone);
      this.startVisualizer();
      this.recorder = RecordRTC(microphone, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        audioBitsPerSecond: 256000,
        disableLogs: true
      });

      this.recorder.startRecording();
      // release microphone on stopRecording
      this.recorder.microphone = microphone;
    });
  }

  public stopRecord() {
    this.recorder.stopRecording(this.stopRecordingCallback.bind(this));
  }

  public playRecord(record: Record) {
    this.currentPlaying = record;
    this.audioElement = new Audio(URL.createObjectURL(record.blob));
    this.audioElement.addEventListener('ended', this.stopPlaying.bind(this));
    this.audioElement.play()
      .then(() => {
        record.isPlaying = true;
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          this.prepareVisualizer((this.audioElement as any).mozCaptureStream());
        } else {
          this.prepareVisualizer((this.audioElement as any).captureStream());
        }
        this.startVisualizer();
      });
  }

  public stopPlaying() {
    if (this.currentPlaying) {
      this.audioElement.pause();
      this.audioElement.removeEventListener('ended', this.stopPlaying);
      this.currentPlaying.isPlaying = false;
      this.currentPlaying = null;
    }
    this.stopVisualizer();
  }

  public removeRecord(record) {
    const recordIndex = this.records.findIndex(r => r === record);
    this.records[recordIndex] = new Record();
  }

  public uploadRecords() {
    for (const record of this.records) {
      record.uploadStatus = 'upload';
      const xhr = new XMLHttpRequest();
      const fd = new FormData();
      fd.append('file', record.blob, 'capture.wav');
      fd.append('wake_word_uuid', this.config.data.wakeWordUuid);
      xhr.open('POST', '/api/record/upload', true);
      // xhr.setRequestHeader('Content-Type', 'audio/wav');
      xhr.upload.addEventListener('loadstart', (event: ProgressEvent) => {
        this.handleUploadProgress(event, record);
      });
      xhr.upload.addEventListener('progress', (event: ProgressEvent) => {
        this.handleUploadProgress(event, record);
      });
      xhr.upload.addEventListener('load', (event: ProgressEvent) => {
        this.handleUploadProgress(event, record);
      });
      xhr.upload.addEventListener('loadend', (event: ProgressEvent) => {
        this.handleUploadProgress(event, record);
      });
      xhr.upload.addEventListener('error', (event: ProgressEvent) => {
        this.handleUploadError(event, record);
      });
      xhr.upload.addEventListener('abort', (event: ProgressEvent) => {
        this.handleUploadError(event, record);
      });

      xhr.addEventListener('loadstart', (event: ProgressEvent) => {
        this.handleUploadProgress(event, record);
      });
      xhr.addEventListener('progress', (event: ProgressEvent) => {
        this.handleUploadProgress(event, record);
      });
      xhr.addEventListener('load', (event: ProgressEvent) => {
        this.handleUploadProgress(event, record);
      });
      xhr.addEventListener('loadend', (event: ProgressEvent) => {
        if (xhr.status !== 200) {
          this.handleUploadError(event, record);
        } else {
          this.handleUploadProgress(event, record);
        }
      });
      xhr.addEventListener('abort', (event: ProgressEvent) => {
        this.handleUploadError(event, record);
      });
      xhr.addEventListener('error', (event: ProgressEvent) => {
        this.handleUploadError(event, record);
      });
      xhr.addEventListener('timeout', (event: ProgressEvent) => {
        this.handleUploadError(event, record);
      });
      xhr.send(fd);
    }
  }

  private handleUploadProgress(event: ProgressEvent, record: Record) {
    console.log('Upload', event.type, event);
    // upload
    if (event.lengthComputable) {
      record.uploadStatus = 'upload';
      switch (event.type) {
        case 'loadstart':
        case 'progress':
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
        record.uploadStatus = 'done';
        break;
    }
  }

  private handleUploadError(event: ProgressEvent, record: Record) {
    console.log('Error', event.type, event);
    record.uploadStatus = 'error';
  }

  private prepareVisualizer(stream: MediaStream) {
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    this.analyserNode = audioContext.createAnalyser();
    this.analyserNode.fftSize = 128;
    source.connect(this.analyserNode);
  }

  private startVisualizer() {
    this.visualizerAnimation = requestAnimationFrame(this.startVisualizer.bind(this));
    const soundDataArray = new Uint8Array(this.analyserNode.frequencyBinCount);
    this.analyserNode.getByteFrequencyData(soundDataArray);

    this.visualizerContext.fillStyle = 'rgb(255, 255, 255)';
    this.visualizerContext.fillRect(0, 0, this.canvas.nativeElement.width, this.canvas.nativeElement.height);
    const barWidth = (this.canvas.nativeElement.width / this.analyserNode.frequencyBinCount);
    let offsetLeft = 0;
    const bars = this.bars.toArray();
    soundDataArray.forEach((barHeight: number, idx: number) => {
      const scale = ((barHeight / 255) + 1);
      bars[idx].nativeElement.style.transform = 'scale3d(' + scale + ', ' + scale + ', 1)';
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
  }

  private captureMicrophone(callback) {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(callback)
      .catch((error) => {
        alert('Unable to access your microphone.');
        console.error(error);
      });
  }

  private stopRecordingCallback() {
    const record = this.currentRecord;
    this.currentRecord = null;
    record.inProgress = null;
    this.recorder.microphone.stop();
    this.stopVisualizer();
    record.blob = this.recorder.getBlob();
  }
}
