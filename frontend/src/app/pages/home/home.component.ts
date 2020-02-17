import { Component, OnDestroy, OnInit } from '@angular/core';
import { WakeWordService, WakeWordWithCount } from '@services';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  public wakeWords: WakeWordWithCount[] = [];

  private refreshWakeWordSubscription: Subscription;

  constructor(private wakeWordService: WakeWordService) {
  }

  ngOnInit() {
    this.fetchWakeWords();
    // const refreshWakeWordsInterval = interval(5000);
    // this.refreshWakeWordSubscription = refreshWakeWordsInterval.subscribe(val => {
    //   this.fetchWakeWords();
    // });
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
}
