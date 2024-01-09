import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GroupSectionComponent } from './group-section.component';

describe('GroupSectionComponent', () => {
  let component: GroupSectionComponent;
  let fixture: ComponentFixture<GroupSectionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GroupSectionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GroupSectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
