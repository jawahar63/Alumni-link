import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConvoComponent } from './convo.component';

describe('ConvoComponent', () => {
  let component: ConvoComponent;
  let fixture: ComponentFixture<ConvoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConvoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ConvoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
