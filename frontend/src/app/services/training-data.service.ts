import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '@environments/environment';
import { TrainingData } from '@models/training-data';
import { map } from 'rxjs/operators';
import { WakeWord } from '@models';
import * as moment from 'moment';
import { WakeWordWithCount } from '@services/wake-word.service';
import { Observable } from 'rxjs';

export interface TrainingDataPaginator {
  total: number;
  currentPage: number;
  pageCount: number;
  itemsPerPage: number;
  data: TrainingData[];
}

@Injectable({
  providedIn: 'root'
})
export class TrainingDataService {

  constructor(private http: HttpClient) { }

  public validate(trainingDataUuid: string): Observable<{statusCode: number}> {
    return this.http.post(environment.HOST + '/api/training-data/validate/' + trainingDataUuid, null)
      .pipe(map((response: {statusCode: number}) => {
        return response;
      }));
  }

  public invalidate(trainingDataUuid: string): Observable<{statusCode: number}> {
    return this.http.post(environment.HOST + '/api/training-data/invalidate/' + trainingDataUuid, null)
      .pipe(map((response: {statusCode: number}) => {
        return response;
      }));
  }

  public getNotValidated(wakeWordUuid: string, limit?: number, page?: number): Observable<TrainingDataPaginator> {
    let params = new HttpParams()
      .set('filters[is_validated]', 'false')
      .set('filters[wake_word]', wakeWordUuid);
    if (limit) {
      params = params.set('max_per_page', limit.toString(10));
    }
    if (page) {
      params = params.set('page', page.toString(10));
    }
    return this.http.get(environment.HOST + '/api/training-data', {params})
      .pipe(map((response: {statusCode: number, data: any}) => {
        const data = {
          total: response.data.total,
          currentPage: response.data.current_page,
          pageCount: response.data.page_count,
          itemsPerPage: response.data.items_per_page,
          data: []
        };
        for (const rawTrainingDataResult of Object.values(response.data.data)) {
          const rawTrainingData = (rawTrainingDataResult as any).training_data;
          const rawWakeWordData = (rawTrainingData as any).wake_word;
          const trainingData = new TrainingData();
          const wakeWord = new WakeWord();
          wakeWord.uuid = rawWakeWordData.uuid;
          wakeWord.labelNormalized = rawWakeWordData.label_normalized;
          wakeWord.label = rawWakeWordData.label;
          wakeWord.created = rawWakeWordData.uuid ?
            moment(rawWakeWordData.created) : null;
          wakeWord.updated = rawWakeWordData.uuid ?
            moment(rawWakeWordData.created) : null;

          trainingData.uuid = rawTrainingData.uuid;
          trainingData.isValidated = rawTrainingData.is_validated;
          trainingData.wakeWord = wakeWord;
          trainingData.created = rawTrainingData.created ?
            moment(rawTrainingData.created) : null;
          trainingData.updated = rawTrainingData.updated ?
            moment(rawTrainingData.updated) : null;
          data.data.push(trainingData);
        }
        return data;
      }));
  }
}
