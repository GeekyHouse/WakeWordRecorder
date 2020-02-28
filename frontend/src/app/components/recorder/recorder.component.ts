import { Component, ElementRef, EventEmitter, Input, OnDestroy, Output, QueryList, ViewChildren } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { RecordEntity } from '@entities';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnDestroy {

  @Input() record: RecordEntity;
  @Input() disabled: boolean;
  @Output() $startRecord: EventEmitter<MediaStream> = new EventEmitter<MediaStream>();
  @Output() $stopRecord: EventEmitter<void> = new EventEmitter<void>();
  @Output() $startPlaying: EventEmitter<MediaStream> = new EventEmitter<MediaStream>();
  @Output() $stopPlaying: EventEmitter<void> = new EventEmitter<void>();

  private recorder: RecordRTC;
  private audioElement: HTMLAudioElement;

  constructor() {
  }

  public ngOnDestroy(): void {
    if (this.recorder) {
      this.recorder.stopRecording();
    }
  }

  public startRecord(): void {
    this.record.inProgress = true;
    this.captureMicrophone((mediaStream: MediaStream) => {
      this.$startRecord.emit(mediaStream);
      this.recorder = RecordRTC(mediaStream, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000, // @TODO: original are 48000, so animation shows this difference :/
        numberOfAudioChannels: 1,
        audioBitsPerSecond: 256000,
        disableLogs: true
      });

      this.recorder.startRecording();
      // release microphone on stopRecording
      this.recorder.mediaStream = mediaStream;
    });
  }

  public stopRecord(): void {
    this.recorder.stopRecording(this.stopRecordingCallback.bind(this));
  }

  public playRecord(): void {
    this.audioElement = new Audio(URL.createObjectURL(this.record.blob));
    this.audioElement.addEventListener('ended', this.stopPlaying.bind(this));
    this.audioElement.play()
      .then(() => {
        this.record.isPlaying = true;
        if (navigator.userAgent.indexOf('Firefox') > -1) {
          this.$startPlaying.emit((this.audioElement as any).mozCaptureStream());
        } else {
          this.$startPlaying.emit((this.audioElement as any).captureStream());
        }
      });
  }

  public stopPlaying(): void {
    if (this.record.isPlaying) {
      this.audioElement.pause();
      this.audioElement.removeEventListener('ended', this.stopPlaying);
      this.record.isPlaying = false;
    }
    this.$stopPlaying.emit();
  }

  public removeRecord(): void {
    this.record.reset();
  }

  private captureMicrophone(callback: (mediaStream: MediaStream) => void): void {
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(callback)
      .catch((error) => {
        alert('Unable to access your microphone.');
        console.error(error);
      });
  }

  private stopRecordingCallback(): void {
    this.record.inProgress = null;
    this.recorder.mediaStream.getTracks().forEach((track: MediaStreamTrack) => {
      track.stop();
    });
    this.record.blob = this.recorder.getBlob();
    this.$stopRecord.emit();
  }
}
