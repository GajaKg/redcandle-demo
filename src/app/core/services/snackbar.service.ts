import { inject, Injectable } from "@angular/core";
import { MatSnackBar, MatSnackBarConfig } from "@angular/material/snack-bar";

@Injectable({
  providedIn: "root"
})
export class SnackBarService {
  private readonly _snackBar = inject(MatSnackBar);
  private readonly _config: MatSnackBarConfig = {
    //  panelClass: 'black-red-snackbar', // 👈 custom class
    panelClass: 'success', // 👈 custom class
    verticalPosition: "top",
    horizontalPosition: "center",
    duration: 3000
  }

  success(message?: string, config?: MatSnackBarConfig) {
    this._snackBar.open(
      message || "Uspešno!",
      "Ok",
      { ...this._config, ...config }
    );
  }

  error(message?: string, config?: MatSnackBarConfig) {
    this._snackBar.open(
      message || "Nešto nije uredu, probajte kasnije!",
      "Ok",
      {
        ...this._config,
        panelClass: 'error',
        duration: 5000,
        ...config
      }
    );
  }
}
