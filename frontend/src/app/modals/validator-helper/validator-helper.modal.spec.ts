import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorHelperModalComponent } from './validator-helper.modal';

describe('ValidatorHelperComponent', () => {
  let component: ValidatorHelperModalComponent;
  let fixture: ComponentFixture<ValidatorHelperModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorHelperModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorHelperModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
