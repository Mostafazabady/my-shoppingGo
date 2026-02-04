import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormControlOptions, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, HttpClientModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  constructor(private _AuthService: AuthService, private _Router: Router) { }

  errMsg: string = ''

  registerForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.pattern(/^\w{6,}$/)]),
    rePassword: new FormControl(''),
    phone: new FormControl('', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]),
  }, { validators: [this.confirmPassword] } as FormControlOptions)



  confirmPassword(group: FormGroup): void {
    const password = group.get('password')
    const rePassword = group.get('rePassword')

    if (rePassword?.value === '') {
      rePassword.setErrors({ required: true })
    }
    else if (password?.value !== rePassword?.value) {
      rePassword?.setErrors({ mismatch: true })
    }
  }


  handleForm() {
    const userData = this.registerForm.value
    const isValid = this.registerForm.valid
    console.log(this.registerForm.value);

    if (isValid) {
      this._AuthService.registerForm(userData).subscribe({
        next: (response) => {
          console.log(response);
          if (response.message === "success") {
            this._Router.navigate(['/login'])
          }
        },
        error: (err) => {
          this.errMsg = err.error.message

        }
      })
    }
  }

}


