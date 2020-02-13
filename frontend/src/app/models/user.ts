import { Moment } from 'moment';

export class User {
  uuid: string;
  name: string;
  pseudonym: string;
  email: string;
  avatarUrl: string;
  created: Moment;
  updated?: Moment;

  constructor() {
  }

  public getPublicName() {
    return this.name || this.pseudonym || this.email;
  }
}
