import { Component, OnDestroy, OnInit } from '@angular/core';
import * as RecordRTC from 'recordrtc';
import { WakeWordService, WakeWordWithCount } from '@services';
import { interval, Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public recordInProgress: string = null;

  public wakeWords: WakeWordWithCount[] = [];

  private recorder: RecordRTC;

  private refreshWakeWordSubscription: Subscription;

  constructor(private wakeWordService: WakeWordService) { }

  ngOnInit() {
    this.fetchWakeWords();
    const refreshWakeWordsInterval = interval(5000);
    this.refreshWakeWordSubscription = refreshWakeWordsInterval.subscribe(val => {
      this.fetchWakeWords();
    });
  }

  ngOnDestroy(): void {
    if (this.refreshWakeWordSubscription) {
      this.refreshWakeWordSubscription.unsubscribe();
    }
  }

  private fetchWakeWords() {
    this.wakeWordService.getAll()
      .subscribe(data => {
        this.wakeWords = data;
      });
  }

  startRecord(wakeWordUuid: string) {
    console.log('startRecord', wakeWordUuid);
    this.recordInProgress = wakeWordUuid;
    this.captureMicrophone((microphone) => {
      console.log('captureMicrophone Callback', this);
      // audio.srcObject = microphone;
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

  stopRecord() {
    console.log('stopRecord', this);
    this.recorder.stopRecording(this.stopRecordingCallback.bind(this));
  }

  captureMicrophone(callback) {
    console.log('captureMicrophone', this);
    navigator.mediaDevices.getUserMedia({audio: true})
      .then(callback)
      .catch((error) => {
        alert('Unable to access your microphone.');
        console.error(error);
      });
  }

  stopRecordingCallback() {
    console.log('stopRecordingCallback', this);
    // audio.srcObject = null;
    const currentWakeWordRecording = this.recordInProgress;
    this.recordInProgress = null;
    console.log('currentWakeWordRecording', currentWakeWordRecording);
    const blob = this.recorder.getBlob();
    this.recorder.microphone.stop();

    const url = URL.createObjectURL(blob);
    // audio.src = url;
    // document.getElementById('download').href = url;
    // document.getElementById('download').download = 'sample.wav';

    console.log(blob);
    console.log(url);

    const audio = new Audio(url);
    audio.play();

    const xhr = new XMLHttpRequest();
    const fd  = new FormData();
    fd.append('file', blob, 'capture.wav');
    fd.append('wake_word_uuid', currentWakeWordRecording);
    xhr.open('POST', '/api/record/upload', true);
    // xhr.setRequestHeader('Content-Type', 'audio/wav');
    xhr.send(fd);
  }
}
