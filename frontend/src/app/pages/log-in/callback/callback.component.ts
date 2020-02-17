import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthenticationService } from '@services';
import { User } from '@models';
import { interval, Subscription } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';
import { ActivatedRoute, DefaultUrlSerializer, Router, UrlTree } from '@angular/router';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.scss']
})
export class CallbackComponent implements OnInit, OnDestroy {
  public message: string;
  public redirect = false;
  public redirectCounter: number;
  public redirectUrl: string;
  public redirectParams = {};
  private redirectInterval: Subscription;
  private redirectTime = 5;

  constructor(private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    this.message = 'Récupération des informations utilisateurs...';

    this.route.paramMap
      .pipe(switchMap(params => {
        const rawRedirectUrl = (params.get('redirect_url') || '/home')
          .replace('%28', '(')
          .replace('%29', ')');

        this.redirectUrl = this.router.serializeUrl(this.router.parseUrl(rawRedirectUrl))
          .replace('%28', '(')
          .replace('%29', ')');
        return this.authenticationService.fetchUser();
      }))
      .subscribe(
        (user: User) => {
          this.message = `Bienvenue ${user.getPublicName()} !`;
          this.redirect = true;
          this.startInterval();
        },
        error => {
          this.message = `Une erreur s'est produite !`;
        }
      );
  }

  ngOnDestroy() {
    if (this.redirectInterval) {
      this.redirectInterval.unsubscribe();
    }
  }

  private startInterval() {
    this.redirectCounter = this.redirectTime;
    this.redirectInterval = interval(1000)
      .pipe(take(this.redirectTime))
      .subscribe(data => {
        this.redirectCounter = this.redirectTime - data - 1;
      }, error => {
      }, () => {
        this.router.navigateByUrl(this.redirectUrl);
      });
  }

}
