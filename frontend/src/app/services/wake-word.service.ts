import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environment';
import { map } from 'rxjs/operators';
import { User, WakeWord } from '@models';
import * as moment from 'moment';
import { Observable } from 'rxjs';

export interface WakeWordWithCount extends WakeWord {
  countTrainingData: number;
  countTrainingDataValidated: number;
}

@Injectable({
  providedIn: 'root'
})
export class WakeWordService {

  constructor(private http: HttpClient) { }

  public getAll(): Observable<WakeWordWithCount[]> {
    return this.http.get(environment.HOST + '/api/wake-word/')
      .pipe(map((response: {statusCode: number, data: any[]}) => {
        const data = [];
        for (const rawWakeWord of Object.values(response.data)) {
          const wakeWord = (new WakeWord()) as WakeWordWithCount;
          wakeWord.uuid = rawWakeWord.wake_word.uuid;
          wakeWord.label = rawWakeWord.wake_word.label;
          wakeWord.labelNormalized = rawWakeWord.wake_word.label_normalized;
          wakeWord.created = rawWakeWord.wake_word.created ? moment(rawWakeWord.wake_word.created) : null;
          wakeWord.updated = rawWakeWord.wake_word.updated ? moment(rawWakeWord.wake_word.updated) : null;
          wakeWord.countTrainingData = rawWakeWord.count_training_data || 0;
          wakeWord.countTrainingDataValidated = rawWakeWord.count_training_data_validated || 0;
          data.push(wakeWord);
        }
        return data;
      }));
  }
}
