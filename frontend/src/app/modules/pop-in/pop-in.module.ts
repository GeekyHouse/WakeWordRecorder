import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PopInComponent } from './components/pop-in/pop-in.component';
import { InsertionDirective } from './directives/insertion.directive';


@NgModule({
  declarations: [PopInComponent, InsertionDirective],
  imports: [
    CommonModule
  ],
  entryComponents: [
    PopInComponent
  ]
})
export class PopInModule {
}
