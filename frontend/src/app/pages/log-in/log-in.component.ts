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
              private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.logout();
    this.route.paramMap
      .subscribe(params => {
        const finalAppUrl = params.get('redirect_url') || '/';
        const loginCallbackUrl = environment.HOST + '/log-in/callback;redirect_url=' + encodeURIComponent(finalAppUrl);
        const githubCallbackUrl = environment.HOST + '/api/oauth/github/callback?redirect_url=' + encodeURIComponent(loginCallbackUrl);
        this.githubUrl  = environment.GITHUB_OAUTH_HOST + '/authorize?';
        this.githubUrl += 'client_id=' + environment.GITHUB_API_CLIENT_ID + '&';
        this.githubUrl += 'scope=read:user&';
        this.githubUrl += 'redirect_uri=' + encodeURIComponent(githubCallbackUrl);

        this.googleUrl = environment.HOST + '/api/oauth/google?redirect_url=' + encodeURIComponent(loginCallbackUrl);
        this.facebookUrl = environment.HOST + '/api/oauth/facebook?redirect_url=' + encodeURIComponent(loginCallbackUrl);
      });
  }

}
