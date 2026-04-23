import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryDetailOrdersComponent } from './category-detail-orders.component';

describe('CategoryDetailOrdersComponent', () => {
  let component: CategoryDetailOrdersComponent;
  let fixture: ComponentFixture<CategoryDetailOrdersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CategoryDetailOrdersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CategoryDetailOrdersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
