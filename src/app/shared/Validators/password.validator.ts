import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function passwordValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value || '';
    const errors: ValidationErrors = {};
    if (value.length < 8) {
      errors['minLength'] = true;
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])/.test(value)) {
      errors['upperLower'] = true;
    }
    if (!/\d/.test(value)) {
      errors['number'] = true;
    }
    if (!/[^A-Za-z0-9]/.test(value)) {
      errors['special'] = true;
    }
    return Object.keys(errors).length ? errors : null;
  };
}