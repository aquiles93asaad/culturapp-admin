import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OpportunityAssignmentComponent } from './opportunity-assignment.component';

describe('OpportunityAssignmentComponent', () => {
  let component: OpportunityAssignmentComponent;
  let fixture: ComponentFixture<OpportunityAssignmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OpportunityAssignmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OpportunityAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
