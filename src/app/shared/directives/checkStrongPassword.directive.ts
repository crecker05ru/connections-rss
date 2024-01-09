import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export const checkStrongPassword = (length: number):ValidatorFn => (
  control: AbstractControl<string>,
): ValidationErrors | null => {
  const matchUpper = /([A-Z]+)/g;
  const matchLower = /([a-z]+)/g;
  const matchDigits = /\d+/;
  const matchSpecials = /[!@#?]+/;
  const errors = {
    matchUpper: !matchUpper.test(control.value),
    matchLower: !matchLower.test(control.value),
    matchDigits: !matchDigits.test(control.value),
    matchSpecials: !matchSpecials.test(control.value),
    matchLength: control?.value?.length < length,
  };
  // if (control.value.length > length
  //   && matchUpper.test(control.value)
  //   && matchLower.test(control.value)
  //   && matchDigits.test(control.value)
  //   && matchSpecials.test(control.value)) {
  // }
  const hasErrors = errors.matchUpper
  || errors.matchLower
  || errors.matchDigits
  || errors.matchSpecials
  || errors.matchLength;

  return hasErrors ? {
    matchUpper: errors.matchUpper,
    matchLower: errors.matchLower,
    matchDigits: errors.matchDigits,
    matchSpecials: errors.matchSpecials,
    matchLength: errors.matchLength,
  } : null;
};
