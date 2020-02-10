import { Component, OnDestroy, OnInit } from '@angular/core';
import { WakeWordService, WakeWordWithCount } from '@services';
import { interval, Subscription } from 'rxjs';
import { PopInService } from '@modules/pop-in/services/pop-in.service';
import { RecorderComponent } from '@components';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public wakeWords: WakeWordWithCount[] = [];

  private refreshWakeWordSubscription: Subscription;

  constructor(private wakeWordService: WakeWordService,
              private popInService: PopInService) {
  }

  ngOnInit() {
    this.fetchWakeWords();
    const refreshWakeWordsInterval = interval(5000);
    // this.refreshWakeWordSubscription = refreshWakeWordsInterval.subscribe(val => {
    //   this.fetchWakeWords();
    // });
  }

  ngOnDestroy(): void {
    if (this.refreshWakeWordSubscription) {
      this.refreshWakeWordSubscription.unsubscribe();
    }
  }

  public validateSamples(wakeWordUuid: string) {
    const ref = this.popInService.open(RecorderComponent, {
      data: {
        wakeWordUuid
      }
    });
    const sub = ref.afterClosed.subscribe(result => {
      console.log('Dialog closed', result);
      sub.unsubscribe();
      this.fetchWakeWords();
    });
  }

  public recordSamples(wakeWordUuid: string) {
    const ref = this.popInService.open(RecorderComponent, {
      data: {
        wakeWordUuid
      }
    });
    const sub = ref.afterClosed.subscribe(result => {
      console.log('Dialog closed', result);
      sub.unsubscribe();
      this.fetchWakeWords();
    });
  }

  private fetchWakeWords() {
    this.wakeWordService.getAll()
      .subscribe(data => {
        this.wakeWords = data;
      });
  }
}
