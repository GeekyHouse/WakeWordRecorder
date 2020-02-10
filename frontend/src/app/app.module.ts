import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor, JwtInterceptor } from '@interceptors';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationService, CookieService } from '@services';
import { CallbackComponent, DocsComponent, HomeComponent, LogInComponent } from '@pages';
import { MomentModule } from 'ngx-moment';
import { ProgressCursorComponent, RecorderComponent } from '@components';
import { PopInModule } from '@modules';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogInComponent,
    CallbackComponent,
    DocsComponent,
    ProgressCursorComponent,
    RecorderComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule,
    PopInModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    AuthenticationService,
    CookieService
  ],
  entryComponents: [RecorderComponent], // @TODO: ugly but needed to open the component on pop-in
  bootstrap: [AppComponent]
})
export class AppModule {
}
