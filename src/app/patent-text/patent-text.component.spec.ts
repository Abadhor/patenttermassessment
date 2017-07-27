import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatentTextComponent } from './patent-text.component';

describe('PatentTextComponent', () => {
  let component: PatentTextComponent;
  let fixture: ComponentFixture<PatentTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatentTextComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatentTextComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
