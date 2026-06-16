import { ChangeDetectionStrategy, Component, inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from "@angular/forms";
import { MatButtonModule } from "@angular/material/button";
import { MatDialogModule } from "@angular/material/dialog";
import { MatIcon } from "@angular/material/icon";
import { MatFormField, MatLabel } from "@angular/material/form-field";
import { MatInput } from "@angular/material/input";
import { CategoriesStore } from "../../store/categories.store";
import { Category } from "../../types/category.interface";

@Component({
  selector: 'app-add-category-dialog',
  templateUrl: './add-category-dialog.component.html',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIcon,
    ReactiveFormsModule,
    FormsModule,
    MatFormField,
    MatInput,
    MatLabel
  ],
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddCategoryDialogComponent implements OnInit {
  private readonly formBuilder = inject(FormBuilder);
  private readonly categoriesStore = inject(CategoriesStore);

  form!: FormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  onSubmit() {
    if (this.form.controls['categoryName'].errors) {
      alert('Unesite tražene podatke');
      return;
    }
    this.categoriesStore.postCategory({
      name: this.form.controls['categoryName'].value
    } satisfies Partial<Category>)

  }

  initForm() {
    this.form = this.formBuilder.group({
      categoryName: [null, Validators.required],
    })
  }
}
