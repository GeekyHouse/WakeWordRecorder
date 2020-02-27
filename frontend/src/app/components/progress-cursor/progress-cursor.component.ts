import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-cursor',
  templateUrl: './progress-cursor.component.html',
  styleUrls: ['./progress-cursor.component.scss']
})
export class ProgressCursorComponent {

  @Input() countStart: number;
  @Input() countEnd: number;
  @Input() countTraining: number;
  @Input() countValidation: number;
  @Input() bubble = false;

  constructor() {
  }

}
