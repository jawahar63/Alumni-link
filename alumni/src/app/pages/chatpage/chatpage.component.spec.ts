import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatpageComponent } from './chatpage.component';

describe('ChatpageComponent', () => {
  let component: ChatpageComponent;
  let fixture: ComponentFixture<ChatpageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatpageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ChatpageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
