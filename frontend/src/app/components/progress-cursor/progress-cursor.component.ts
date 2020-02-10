import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-cursor',
  templateUrl: './progress-cursor.component.html',
  styleUrls: ['./progress-cursor.component.scss']
})
export class ProgressCursorComponent implements OnInit {

  @Input() total: number;
  @Input() cursors: number[];
  @Input() color = '#f00';
  @Input() label = false;

  constructor() {
  }

  ngOnInit() {
  }

}
