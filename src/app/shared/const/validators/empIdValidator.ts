import { AbstractControl, ValidationErrors } from '@angular/forms';

export class EmpIdValidator {
  static isEmpIdValid(control: AbstractControl): ValidationErrors | null {
    let val: string = control.value;
    if (!val) {
      return null;
    }
    // below is regular expression and test is its method, check methods of regular expression
    let regExp = /^[A-Z]\d{3}$/;
    let isValid = regExp.test(val);
    if (isValid) {
      return null;
    } else {
      return {
        inValidEmpId:
          'Invalid Employee id pattern(must start with 1 alphabet and ends with 3 numbers',
      };
    }
  }
}
