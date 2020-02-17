import { AfterViewInit, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthenticationService } from '@services';
import { Observable } from 'rxjs';
import { User } from '@models';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'wwr';
  // user$: Observable<User>;
  user: User;

  constructor(private authenticationService: AuthenticationService,
              private cd: ChangeDetectorRef) {
  }

  ngOnInit() {
    this.authenticationService.currentUser.subscribe(user => {
      this.user = user;
      // cannot use observable and force change detection if child component update user status
      this.cd.detectChanges();
    });
    // this.user$ = this.authenticationService.currentUser;
  }

  ngAfterViewInit() {
    // this.user$ = this.authenticationService.currentUser;
  }
}
