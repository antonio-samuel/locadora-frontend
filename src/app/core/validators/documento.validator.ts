import { AbstractControl, ValidationErrors } from '@angular/forms';

export function cpfValidator(control: AbstractControl): ValidationErrors | null {
  const digits = (control.value ?? '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length !== 11) {
    return { cpfInvalido: { atual: digits.length, esperado: 11 } };
  }
  return null;
}

export function cnhValidator(control: AbstractControl): ValidationErrors | null {
  const digits = (control.value ?? '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length < 10 || digits.length > 11) {
    return { cnhInvalida: { atual: digits.length } };
  }
  return null;
}

export function telefoneValidator(control: AbstractControl): ValidationErrors | null {
  const digits = (control.value ?? '').replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length < 10 || digits.length > 11) {
    return { telefoneInvalido: { atual: digits.length } };
  }
  return null;
}