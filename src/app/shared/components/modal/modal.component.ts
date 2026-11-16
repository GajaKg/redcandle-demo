import { Component, model, output, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-modal',
    imports: [],
    templateUrl: './modal.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './modal.component.scss'
})
export class ModalComponent {
  public readonly onClose = output();
  public showModal = model<boolean>(false);

  public closeModal() {
    this.showModal.set(false);
    this.onClose.emit();
  }
}
