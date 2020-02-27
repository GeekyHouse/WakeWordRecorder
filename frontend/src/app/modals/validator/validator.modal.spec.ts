import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorModalComponent } from './validator.modal';

describe('Validator.ModalComponent', () => {
  let component: ValidatorModalComponent;
  let fixture: ComponentFixture<ValidatorModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidatorModalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidatorModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
