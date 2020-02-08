import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards';
import { CallbackComponent as LogInCallbackComponent, DocsComponent, HomeComponent, LogInComponent } from '@pages';


const routes: Routes = [
  {path: 'log-in', component: LogInComponent},
  {path: 'log-in/callback', component: LogInCallbackComponent},
  {path: 'home', component: HomeComponent, canActivate: [AuthGuard]},
  {path: 'docs', component: DocsComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
