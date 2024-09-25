import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import Client from '../../../interfaces/client.interface';

@Component({
  selector: 'app-client-form',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './client-form.component.html',
  styleUrl: './client-form.component.scss',
})
export class ClientFormComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  protected form!: FormGroup;

  @Output() submitEmit = new EventEmitter();

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    this.form = this.formBuilder.group({
      name: ['', [Validators.required]],
      address: ['', [Validators.required]],
      contact: ['', [Validators.required]],
      note: ['', []],
    });
  }

  onSubmit() {
    if (
      this.form.controls['name'].errors ||
      this.form.controls['address'].errors ||
      this.form.controls['contact'].errors
    ) {
      alert('Unesite tražene podatke');
      return;
    }

    const name = this.form.controls['name'].value;
    const address = this.form.controls['address'].value;
    const contact = this.form.controls['contact'].value;
    const note = this.form.controls['note'].value;

    this.submitEmit.emit({
      name,
      address,
      contact,
      note,
    });

    this.form.reset();
  }
}
