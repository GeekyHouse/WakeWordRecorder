import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { TrainingDataPaginator, TrainingDataService } from '@services/training-data.service';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { TrainingData } from '@models/training-data';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-validator-modal',
  templateUrl: './validator.modal.html',
  styleUrls: ['./validator.modal.scss']
})
export class ValidatorModalComponent implements OnInit, OnDestroy {

  @ViewChild('visualizer', {static: false})
  canvas: ElementRef<HTMLCanvasElement>;
  public trainingData: TrainingData;
  public isPlaying = false;
  public isListened = false;
  private wakeWordUuid: string;
  private subscriptions: Subscription[] = [];
  private visualizerContext: CanvasRenderingContext2D;
  private audioElement: HTMLAudioElement;
  private visualizerAnimation: number;
  private page = 1;

  constructor(private trainingDataService: TrainingDataService,
              private activatedRoute: ActivatedRoute,
              private http: HttpClient) {
  }

  ngOnInit() {
    this.subscriptions.push(this.activatedRoute.params.subscribe((params: Params) => {
      this.wakeWordUuid = params.wakeWordUuid;
    }));
    this.loadData();
  }

  public ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => {
      subscription.unsubscribe();
    });
    if (this.visualizerAnimation) {
      cancelAnimationFrame(this.visualizerAnimation);
    }
    if (this.audioElement) {
      this.pause();
      this.audioElement = null;
    }
  }

  public play() {
    this.audioElement.play()
      .then(() => {
        this.isPlaying = true;
        this.audioElement.addEventListener('ended', this.end.bind(this));
      });
  }

  public pause(): void {
    this.isPlaying = false;
    this.audioElement.pause();
    this.audioElement.removeEventListener('ended', this.end);
  }

  public validate(): void {
    this.trainingDataService.validate(this.trainingData.uuid)
      .subscribe(response => {
        // show next
        console.log('Validation good, show next');
        this.trainingData = null;
        this.loadData();
      });
  }

  public invalidate(): void {
    this.trainingDataService.validate(this.trainingData.uuid)
      .subscribe(response => {
        // show next
        console.log('Invalidation good, show next');
        this.trainingData = null;
        this.loadData();
      });
  }

  public next(): void {
    console.log('show next');
    this.trainingData = null;
    this.page++;
    this.loadData();
  }

  private loadData(): void {
    this.subscriptions.push(this.trainingDataService.getNotValidated(this.wakeWordUuid, 1, this.page)
      .subscribe((data: TrainingDataPaginator) => {
        if (data.data.length > 0) {
          this.trainingData = data.data[0];

          this.subscriptions.push(this.http.get('/api/record/download/' + this.trainingData.uuid, {
            responseType: 'arraybuffer'
          }).subscribe((arrayBuffer: ArrayBuffer) => {
            const blob = new Blob([arrayBuffer], {type: 'audio/wav'});
            this.audioElement = new Audio();
            this.audioElement.src = URL.createObjectURL(blob);

            this.visualizerContext = this.canvas.nativeElement.getContext('2d');
            const audioContext = new AudioContext();
            return audioContext.decodeAudioData(arrayBuffer)
              .then((audioBuffer: AudioBuffer) => this.normalizeData(this.filterBuffer(audioBuffer)))
              .then((normalizedData: number[]) => this.drawVisualizer(normalizedData));
          }));
        }
      }));
  }

  private end(): void {
    this.isPlaying = false;
    this.isListened = true;
    this.audioElement.removeEventListener('ended', this.end);
  }

  private drawVisualizer(normalizedData: number[]): void {
    this.visualizerAnimation = requestAnimationFrame(this.drawVisualizer.bind(this, normalizedData));
    // Set up the canvas
    const dpr = window.devicePixelRatio || 1;
    const margin = 1;
    const colorOn = '102, 102, 255';
    const colorOff = '230, 230, 230';
    this.canvas.nativeElement.width = this.canvas.nativeElement.offsetWidth * dpr;
    this.canvas.nativeElement.height = this.canvas.nativeElement.offsetHeight * dpr;
    // @TODO: enable this debug, it never end
    // console.log('DEBUG', this.canvas.nativeElement.offsetWidth, this.canvas.nativeElement.offsetHeight);

    this.visualizerContext.scale(dpr, dpr);

    // draw background
    this.visualizerContext.fillStyle = '#fff';
    this.visualizerContext.fillRect(0, 0, this.canvas.nativeElement.offsetWidth, this.canvas.nativeElement.offsetHeight);

    const third = this.canvas.nativeElement.offsetHeight / 3;
    this.visualizerContext.translate(margin, third * 2);

    // draw the line segments
    const width = ((this.canvas.nativeElement.offsetWidth - margin * 2) / normalizedData.length) - margin;
    let audioPercent = 0;
    if (this.audioElement) {
      audioPercent = this.audioElement.currentTime / this.audioElement.duration * 100;
    }

    // "middle" line
    this.visualizerContext.strokeStyle = `rgba(${colorOff}, .1)`;
    this.visualizerContext.beginPath();
    this.visualizerContext.moveTo(this.canvas.nativeElement.offsetWidth * audioPercent / 100, 0);
    this.visualizerContext.lineTo(this.canvas.nativeElement.offsetWidth, 0);
    this.visualizerContext.stroke();
    this.visualizerContext.strokeStyle = `rgba(${colorOn}, .5)`;
    this.visualizerContext.beginPath();
    this.visualizerContext.moveTo(0, 0);
    this.visualizerContext.lineTo(this.canvas.nativeElement.offsetWidth * audioPercent / 100, 0);
    this.visualizerContext.stroke();

    for (let i = 0; i < normalizedData.length; i++) {
      const currentPercent = (i + 1) * 100 / normalizedData.length;
      const x = (width + margin) * i;
      let height = normalizedData[i] * third;
      height = Math.min(Math.max(height, 0), third);

      const color = currentPercent <= audioPercent ? colorOn : colorOff;
      // height = currentPercent <= audioPercent ? height : 0;
      const linearGradientMain = this.visualizerContext.createLinearGradient(0, third * -2, 0, 0);
      linearGradientMain.addColorStop(0, `rgba(${color}, .5)`);
      linearGradientMain.addColorStop(1, `rgba(${color}, 1)`);

      const linearGradientSecondary = this.visualizerContext.createLinearGradient(0, 0, 0, third);
      linearGradientSecondary.addColorStop(0, `rgba(${color}, .5)`);
      linearGradientSecondary.addColorStop(1, `rgba(${color}, 0)`);

      this.visualizerContext.fillStyle = linearGradientMain; // `rgba(${color}, 1)`;
      this.visualizerContext.fillRect(x, 0, width, (height * -2));

      this.visualizerContext.fillStyle = linearGradientSecondary; // `rgba(${color}, .5)`;
      this.visualizerContext.fillRect(x, 0, width, height);
    }
  }

  private filterBuffer(audioBuffer: AudioBuffer): number[] {
    const rawData = audioBuffer.getChannelData(0); // We only need to work with one channel of data
    const samples = 100; // Number of samples we want to have in our final data set
    const blockSize = Math.floor(rawData.length / samples); // the number of samples in each subdivision
    const filteredData = [];
    for (let i = 0; i < samples; i++) {
      const blockStart = blockSize * i; // the location of the first sample in the block
      let sum = 0;
      for (let j = 0; j < blockSize; j++) {
        sum = sum + Math.abs(rawData[blockStart + j]); // find the sum of all the samples in the block
      }
      filteredData.push(sum / blockSize); // divide the sum by the block size to get the average
    }
    return filteredData;
  }

  private normalizeData(filteredData: number[]): number[] {
    const multiplier = Math.pow(Math.max(...filteredData), -1);
    return filteredData.map(n => n * multiplier);
  }
}
