import { Component, input, model, output } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
@Component({
  selector: 'app-chips',
  standalone: true,
  imports: [MatChipsModule],
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.scss',
})
export class ChipsComponent {
  public label = input<string>('');
  public items = input<string[] | number[]>([]);
  public defaultValue = model(new Date().getFullYear());
  public onClick = output<void>();

  protected clickHandler(item: any): void {
    this.defaultValue.set(item);
    this.onClick.emit(item);
  }
}
