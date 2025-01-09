import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersChartYearlyComponent } from './orders-chart-yearly.component';

describe('OrdersChartYearlyComponent', () => {
  let component: OrdersChartYearlyComponent;
  let fixture: ComponentFixture<OrdersChartYearlyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersChartYearlyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersChartYearlyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
