import { Component, OnInit } from '@angular/core';
import { PopInConfig } from '@modules/pop-in/config/pop-in.config';
import { PopInRef } from '@modules/pop-in/references/pop-in.reference';
import * as RecordRTC from 'recordrtc';

@Component({
  selector: 'app-recorder',
  templateUrl: './recorder.component.html',
  styleUrls: ['./recorder.component.scss']
})
export class RecorderComponent implements OnInit {

  public recordInProgress = false;

  private recorder: RecordRTC;

  constructor(public config: PopInConfig, public popInRef: PopInRef) {
  }

  ngOnInit() {
    console.log('config', this.config);
  }

  onClose() {
    this.popInRef.close('some value');
  }


  startRecord() {
    console.log('startRecord');
    this.recordInProgress = true;
    this.captureMicrophone((microphone) => {
      console.log('captureMicrophone Callback', this);
      // audio.srcObject = microphone;
      const audioContext = new AudioContext();
      const analyserNode = audioContext.createAnalyser();
      this.recorder = RecordRTC(microphone, {
        type: 'audio',
        mimeType: 'audio/wav',
        recorderType: RecordRTC.StereoAudioRecorder,
        desiredSampRate: 16000,
        numberOfAudioChannels: 1,
        audioBitsPerSecond: 256000,
        disableLogs: true,
        timeSlice: 100,
        ondataavailable: (data) => {
          // data.arrayBuffer().then(buffer => {
          //   const freq = analyserNode.getByteFrequencyData(new Uint8Array(buffer));
          //   console.log(freq);
          // });
        }
      });

      this.recorder.startRecording();

      console.log(this.recorder);

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
    this.recordInProgress = false;
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
    const fd = new FormData();
    fd.append('file', blob, 'capture.wav');
    fd.append('wake_word_uuid', this.config.data.wakeWordUuid);
    xhr.open('POST', '/api/record/upload', true);
    // xhr.setRequestHeader('Content-Type', 'audio/wav');
    xhr.send(fd);
  }
}
