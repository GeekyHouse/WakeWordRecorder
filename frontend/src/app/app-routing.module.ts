import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@guards';
import { CallbackComponent as LogInCallbackComponent, DocsComponent, HomeComponent, LogInComponent } from '@pages';
import { ModalViewComponent } from '@components/modal-view/modal-view.component';
import { TrainingModalComponent, ValidatorHelperModalComponent, ValidatorModalComponent } from '@modals';


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
    data: {animation: 'Modal'},
    children: [
      {
        path: 'recorder/:wakeWordUuid',
        component: TrainingModalComponent,
        canActivate: [AuthGuard],
        data: {animation: 'ModalMain'},
      },
      {
        path: 'validator/help',
        component: ValidatorHelperModalComponent,
        data: {animation: 'ModalHelp'},
      },
      {
        path: 'validator/:wakeWordUuid',
        component: ValidatorModalComponent,
        canActivate: [AuthGuard],
        data: {animation: 'ModalMain'},
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
