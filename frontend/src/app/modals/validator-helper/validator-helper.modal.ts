import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-validator-helper-modal',
  templateUrl: './validator-helper.modal.html',
  styleUrls: ['./validator-helper.modal.scss']
})
export class ValidatorHelperModalComponent {

  constructor(
    private location: Location
  ) {
  }

  back() {
    this.location.back();
  }

}
