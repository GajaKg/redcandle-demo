import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientDetailOrderFormComponent } from './client-detail-order-form.component';

describe('ClientDetailOrderFormComponent', () => {
  let component: ClientDetailOrderFormComponent;
  let fixture: ComponentFixture<ClientDetailOrderFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientDetailOrderFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientDetailOrderFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
