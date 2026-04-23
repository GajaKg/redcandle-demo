import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetailProductionComponent } from './category-detail-production.component';

describe('CategoryDetailProductionComponent', () => {
  let component: CategoryDetailProductionComponent;
  let fixture: ComponentFixture<CategoryDetailProductionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDetailProductionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDetailProductionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
