import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards';
import { CallbackComponent as LogInCallbackComponent, DocsComponent, HomeComponent, LogInComponent } from '@pages';
import { ModalViewComponent } from '@components/modal-view/modal-view.component';
import { TrainingModalComponent } from '@modals';


const routes: Routes = [
  {path: 'log-in', component: LogInComponent},
  {path: 'log-in/callback', component: LogInCallbackComponent},
  {path: 'home', component: HomeComponent},
  {path: 'docs', component: DocsComponent, canActivate: [AuthGuard]},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: '**', redirectTo: 'home'},
  {
    path: 'modal',
    outlet: 'modal',
    component: ModalViewComponent,
    children: [
      {
        path: 'recorder/:wakeWordUuid',
        component: TrainingModalComponent,
        canActivate: [AuthGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
