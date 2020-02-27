import { Moment } from 'moment';
import { WakeWord } from '@models/wake-word';

export class TrainingData {
  uuid: string;
  isValidated: boolean;
  created: Moment;
  updated?: Moment;
  wakeWord: WakeWord;

  constructor() {
  }
}
