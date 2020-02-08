import { Injectable } from '@angular/core';
import { environment } from '@environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Moment } from 'moment';
import { User } from '@models';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  public getCurrentUser() {
    return this.http.get(environment.HOST + '/api/auth/me/user')
      .pipe(map((response: {statusCode: number, data: any}) => {
        const user = new User();
        user.uuid = response.data.uuid;
        user.name = response.data.name;
        user.pseudonym = response.data.pseudonym;
        user.email = response.data.email;
        user.avatarUrl = response.data.avatar_url;
        user.created = moment(response.data.created);
        user.updated = response.data.updated ? moment(response.data.updated) : null;
        return user;
      }));
  }
}
