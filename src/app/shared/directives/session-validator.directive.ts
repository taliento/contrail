import { AbstractControl, ValidatorFn } from '@angular/forms';

export function forbiddenPlaceValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value) {
      return { forbiddenPlace: { value: control.value } };
    }

    return control.value.PlaceId
      ? null
      : { forbiddenPlace: { value: control.value } };
  };
}
export function inboundDateValidator(ticketType: string): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (ticketType === 'oneWay') {
      return null;
    }
    return !control.value ? { required: true } : null;
  };
}
