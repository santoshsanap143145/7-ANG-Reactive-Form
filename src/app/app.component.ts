import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { CustomRegex } from './shared/const/validators/validatorpatterns';
import { NoSpaceBarValidator } from './shared/const/validators/noSpaceBar';
import { EmpIdValidator } from './shared/const/validators/empIdValidator';
import { Icountry } from './shared/models/country';
import { COUNTRIES_META_DATA } from './shared/const/country/countries';
import { STATES_AND_UTS } from './shared/const/country/states';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = '7-ANG-Reactive-Form';
  signUpForms!: FormGroup;
  genderArr: Array<string> = ['male', 'female', 'others'];
  countries: Array<Icountry> = COUNTRIES_META_DATA;
  states: Array<string> = STATES_AND_UTS;
  constructor() {}

  ngOnInit(): void {
    // never write functionality in ngOnIniit, here we should call methods only
    this.createSignUpForm();
    this.addSkills();
    this.addDependents();
    this.isAddressSameHandler();
    this.patchAddressHandler();
    this.confirmPasswordHandler()
    this.confirmPasswordValidation()
  }

  createSignUpForm() {
    this.signUpForms = new FormGroup({
      // userName: new FormControl(null, Validators.required),
      userName: new FormControl(null, [
        Validators.required,
        Validators.minLength(6),
        Validators.maxLength(12),
        Validators.pattern(CustomRegex.username),
        NoSpaceBarValidator.noSpace,
      ]),
      email: new FormControl(null, [
        Validators.required,
        Validators.pattern(CustomRegex.email),
        NoSpaceBarValidator.noSpace,
      ]),
      empId: new FormControl(null, [
        Validators.required,
        EmpIdValidator.isEmpIdValid,
      ]),
      gender: new FormControl('male'),
      currentAddress: new FormGroup({
        country: new FormControl('India', [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        pincode: new FormControl(null, [Validators.required]),
      }),
      permanentAddress: new FormGroup({
        country: new FormControl('India', [Validators.required]),
        state: new FormControl(null, [Validators.required]),
        city: new FormControl(null, [Validators.required]),
        pincode: new FormControl(null, [Validators.required]),
      }),
      isAddressSame: new FormControl({ value: false, disabled: true }),
      skills: new FormArray([]),
      dependents: new FormArray([]),
      password: new FormControl(null, [
        Validators.required,
        Validators.pattern(CustomRegex.password),
      ]),
      confirmPassword: new FormControl({ value: null, disabled: true }, [
        Validators.required,
      ]),
    });
    // we can add single validators as well as multiple validators in array, array of synchronous validators
    // there are also asynchronous validators for example validation of username where it checks if account is already created using entered email id

    // API call to create new account
  }

  isAddressSameHandler() {
    this.f['currentAddress'].valueChanges.subscribe((res) => {
      console.log('is valid', this.f['currentAddress'].valid);
      if (this.f['currentAddress'].valid) {
        this.f['isAddressSame'].enable();
      } else {
        this.f['isAddressSame'].disable();
        // this.f['isAddressSame'].reset()
        // this.f['permanentAddress'].reset()
        // this.f['permanentAddress'].enable()
      }
    });
  }

  patchAddressHandler() {
    this.f['isAddressSame'].valueChanges.subscribe((res: boolean) => {
      console.log('isAddressSame changed to:', res);
      if (res === true) {
        let currentAddressData = this.f['currentAddress'].value;
        this.f['permanentAddress'].patchValue(currentAddressData);
        this.f['permanentAddress'].disable();
      } else {
        this.f['permanentAddress'].reset();
        this.f['permanentAddress'].enable();
      }
    });
  }

  addSkills() {
    if (this.skillsArr.length < 5) {
      // create a form control
      let skillControl = new FormControl(null, [Validators.required]);
      // and push in formArray
      this.skillsArr.push(skillControl);
    }
  }

  removeskill(index: number) {
    this.skillsArr.removeAt(index);
  }

  addDependents() {
    if (this.dependentsArr.length < 5) {
      let dependentGroup = new FormGroup({
        fullName: new FormControl(null, [Validators.required]),
        relationship: new FormControl(null, [Validators.required]),
        citizenship: new FormControl(null, [Validators.required]),
        isTravelingWithYou: new FormControl(null, [Validators.required]),
      });

      this.dependentsArr.push(dependentGroup);
    }
  }

  removeDependent(index: number) {
    this.dependentsArr.removeAt(index);
  }

  confirmPasswordHandler(){
    this.f['password'].valueChanges
    .subscribe(res => {
      if(this.f['password'].valid){
        this.f['confirmPassword'].enable()
        this.f['confirmPassword'].updateValueAndValidity();
      }else{
        this.f['confirmPassword'].disable()
        this.f['confirmPassword'].reset()
      }
    })
  }

  confirmPasswordValidation(){
    this.f['confirmPassword'].valueChanges
    .subscribe(confirmPasswordValue => {
      if(this.f['password'].value === confirmPasswordValue){
        this.f['confirmPassword'].setErrors(null)
      }else{
        this.f['confirmPassword'].setErrors({
          passwordMathError: `Password and Confirm-password must be same.`
        })
      }
    })
  }

  onSignUp() {
    console.log(this.signUpForms);
    if (this.signUpForms.valid) {
      console.log(this.signUpForms.value);
      console.log(this.signUpForms.getRawValue);
      // this.signUpForms.reset();
      let val = {...this.signUpForms.getRawValue}
    }
    console.log(this.signUpForms.value.dependents);
    this.signUpForms.value.dependents = this.signUpForms.value.dependents.map((d: any) => {
      return {
        ...d,
        isTravelingWithYou : d.isTravelingWithYou == 'yes' ? true : false
      }
    })
    
  }

  // method to get for all controls in from
  get f() {
    return this.signUpForms.controls;
  }

  // method to get for one control
  get userName() {
    return this.signUpForms.get('userName') as FormControl;
  }

  get skillsArr() {
    return this.f['skills'] as FormArray;
  }
  get dependentsArr() {
    return this.f['dependents'] as FormArray;
  }
}
