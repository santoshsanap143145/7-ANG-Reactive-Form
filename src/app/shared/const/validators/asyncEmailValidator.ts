import { AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

export class AsyncEmailValidator {
  static isEmailAvailable(
    control: AbstractControl
  ): Promise<ValidationErrors | null> | Observable<ValidationErrors | null> {
    let val: string = control.value;
    if (!val) {
      return Promise.resolve(null);
    }

    const promise = new Promise<ValidationErrors | null>((resolve, reject) => {
      setTimeout(() => {
        if (val === 'jhon@gmail.com') {
          resolve({
            emailExistErr: `this email id is already in use..`,
          });
        } else {
          resolve(null);
        }
      }, 3000);
    });

    return promise;
  }
}
