import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services';
import { Observable } from 'rxjs';
import { User } from '@models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'wwr';
  user$: Observable<User>;

  constructor(private authenticationService: AuthenticationService) {
  }

  ngOnInit() {
    this.user$ = this.authenticationService.currentUser;
  }
}
