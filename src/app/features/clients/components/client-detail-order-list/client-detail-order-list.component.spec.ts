import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDetailOrderListComponent } from './client-detail-order-list.component';

describe('ClientDetailOrderListComponent', () => {
  let component: ClientDetailOrderListComponent;
  let fixture: ComponentFixture<ClientDetailOrderListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDetailOrderListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDetailOrderListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
