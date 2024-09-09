import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTempComponent } from './post-temp.component';

describe('PostTempComponent', () => {
  let component: PostTempComponent;
  let fixture: ComponentFixture<PostTempComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostTempComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PostTempComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
