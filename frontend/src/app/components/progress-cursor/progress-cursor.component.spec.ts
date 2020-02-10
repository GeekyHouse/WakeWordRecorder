import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProgressCursorComponent } from './progress-cursor.component';

describe('ProgressCursorComponent', () => {
  let component: ProgressCursorComponent;
  let fixture: ComponentFixture<ProgressCursorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProgressCursorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProgressCursorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
