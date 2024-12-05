import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrdersChartComponent } from './orders-chart-monthly.component';

describe('OrdersChartComponent', () => {
  let component: OrdersChartComponent;
  let fixture: ComponentFixture<OrdersChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrdersChartComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrdersChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
