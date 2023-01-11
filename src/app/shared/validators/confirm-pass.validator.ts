import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function confirmPassVal(): ValidatorFn {
  return (campoForm: AbstractControl): ValidationErrors | null => {
    const form = campoForm.parent;
    const password = form?.get('password')?.value;
    const confirmPass = form?.get('confirmPass')?.value;

    return password === confirmPass ? null : { confirmPass: true };
  };
}
