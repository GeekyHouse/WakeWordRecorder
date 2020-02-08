import { Moment } from 'moment';

export class WakeWord {
  uuid: string;
  label: string;
  labelNormalized: string;
  created: Moment;
  updated?: Moment;

  constructor() {
  }
}
