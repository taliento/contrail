import { ValidatorFn, AbstractControl } from "@angular/forms";

/** A hero's name can't match the given regular expression */
export function forbiddenPlaceValidator(): ValidatorFn {
  return (control: AbstractControl): {[key: string]: any} | null => {

    if(!control.value) {
      return {'forbiddenPlace': {value: control.value}};
    }

    return control.value.PlaceId ? null : {'forbiddenPlace': {value: control.value}};
  };
}