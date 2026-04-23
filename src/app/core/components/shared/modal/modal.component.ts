import { Component, model, output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.scss',
})
export class ModalComponent {
  public readonly onClose = output();
  public showModal = model<boolean>(false);

  public closeModal() {
    this.showModal.set(false);
    this.onClose.emit();
  }
}
