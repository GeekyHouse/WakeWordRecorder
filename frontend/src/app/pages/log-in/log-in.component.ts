import { Component, OnInit } from '@angular/core';
import { environment } from '@environments/environment';
import { ActivatedRoute } from '@angular/router';
import { AuthenticationService } from '@services';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  public githubUrl: string;
  public googleUrl: string;
  public facebookUrl: string;

  constructor(private route: ActivatedRoute,
              private authenticationService: AuthenticationService) {
  }

  private static encodeURIComponent(url: string) {
    return encodeURIComponent(url)
      .replace('(', '%28')
      .replace(')', '%29')
      ;
  }

  ngOnInit() {
    this.authenticationService.logout();
    this.route.paramMap
      .subscribe(params => {
        console.log(params.get('redirect_url'));
        const finalAppUrl = params.get('redirect_url') || '/home';
        const loginCallbackUrl = environment.HOST + '/log-in/callback;redirect_url=' + LogInComponent.encodeURIComponent(finalAppUrl);
        const githubCallbackUrl = environment.HOST + '/api/oauth/github/callback?redirect_url=' + LogInComponent.encodeURIComponent(loginCallbackUrl);
        this.githubUrl = environment.GITHUB_OAUTH_HOST + '/authorize?';
        this.githubUrl += 'client_id=' + environment.GITHUB_API_CLIENT_ID + '&';
        this.githubUrl += 'scope=read:user&';
        this.githubUrl += 'redirect_uri=' + LogInComponent.encodeURIComponent(githubCallbackUrl);

        this.googleUrl = environment.HOST + '/api/oauth/google?redirect_url=' + LogInComponent.encodeURIComponent(loginCallbackUrl);
        this.facebookUrl = environment.HOST + '/api/oauth/facebook?redirect_url=' + LogInComponent.encodeURIComponent(loginCallbackUrl);
      });
  }
}
