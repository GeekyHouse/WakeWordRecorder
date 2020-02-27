import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '@models';
import { CookieService } from '@services/cookie.service';
import * as moment from 'moment';
import { map } from 'rxjs/operators';
import { UserService } from '@services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUser: Observable<User>;
  private currentUserSubject: BehaviorSubject<User>;

  constructor(private cookieService: CookieService,
              private userService: UserService) {
    let user;
    try {
      user = JSON.parse(localStorage.getItem('user'));
    } catch {}
    this.currentUserSubject = new BehaviorSubject<User>(user);
    this.currentUser = this.currentUserSubject.asObservable();
  }

  public getToken(): string {
    const token = this.cookieService.get('x-token');
    if (!token) {
      return null;
    }
    const expires = JSON.parse(atob(token.split('.')[1])).exp;
    if (moment().unix() > expires) {
      return null;
    }
    return token;
  }

  public get currentUserValue(): User {
    // check token
    const token = this.getToken();
    if (!token) {
      console.log('Bad token');
      this.logout();
    }
    // return user
    return this.currentUserSubject.value;
  }

  public isLogged(): boolean {
    return !!this.currentUserSubject.value;
  }

  public logout(): void {
    console.log('LOGOUT');
    this.cookieService.delete('x-token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  public fetchUser() {
    console.log('FETCH USER');
    return this.userService.getCurrentUser()
      .pipe(map((user: User) => {
        localStorage.setItem('user', JSON.stringify(user));
        this.currentUserSubject.next(user);
        return user;
      }));
  }
}
