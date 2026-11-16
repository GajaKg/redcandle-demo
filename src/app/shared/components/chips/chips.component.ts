import { Component, input, model, output, ChangeDetectionStrategy } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
@Component({
    selector: 'app-chips',
    imports: [MatChipsModule],
    templateUrl: './chips.component.html',
    changeDetection: ChangeDetectionStrategy.Eager,
    styleUrl: './chips.component.scss'
})
export class ChipsComponent {
  public label = input<string>('');
  public items = input<string[] | number[]>([]);
  public defaultValue = model(new Date().getFullYear());
  public onClick = output<number>();

  protected clickHandler(item: any): void {
    this.defaultValue.set(item);
    this.onClick.emit(item);
  }
}
