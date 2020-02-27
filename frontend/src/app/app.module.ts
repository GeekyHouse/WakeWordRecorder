import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ErrorInterceptor, JwtInterceptor } from '@interceptors';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthenticationService, CookieService } from '@services';
import { CallbackComponent, DocsComponent, HomeComponent, LogInComponent } from '@pages';
import { MomentModule } from 'ngx-moment';
import { ModalViewComponent, ProgressCursorComponent, RecorderComponent } from '@components';
import { PopInModule } from '@modules';
import { CustomSerializer } from './custom.serializer';
import { UrlSerializer } from '@angular/router';
import { TrainingModalComponent, ValidatorHelperModalComponent, ValidatorModalComponent } from '@modals';
import { LoaderComponent } from '@components/loader/loader.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LogInComponent,
    CallbackComponent,
    DocsComponent,
    ProgressCursorComponent,
    ModalViewComponent,
    RecorderComponent,
    TrainingModalComponent,
    ValidatorModalComponent,
    ValidatorHelperModalComponent,
    LoaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    HttpClientModule,
    MomentModule,
    PopInModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
    AuthenticationService,
    CookieService,
    {provide: UrlSerializer, useClass: CustomSerializer}
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
