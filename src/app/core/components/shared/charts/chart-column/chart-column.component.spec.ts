import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartColumnComponent } from './chart-column.component';

describe('ChartColumnComponent', () => {
  let component: ChartColumnComponent;
  let fixture: ComponentFixture<ChartColumnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartColumnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartColumnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
