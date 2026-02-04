import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl,FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from "@angular/router";
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from 'src/app/Services/auth.service';


@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
 constructor(private _AuthService:AuthService, private _Router:Router){}

  errMsg:string = ''
  
  loginForm:FormGroup = new FormGroup({
    name: new FormControl('',[Validators.required, Validators.minLength(3), Validators.maxLength(30)]),
    email: new FormControl('',[Validators.required, Validators.email]),
    password: new FormControl('',[Validators.required, Validators.pattern(/^\w{6,}$/)]),

  })


  handleForm(){
    const userData = this.loginForm.value
    const isValid = this.loginForm.valid
        console.log(this.loginForm.value);
    if (isValid) {
      this._AuthService.loginForm(userData).subscribe({
        next:(response)=>{
          console.log(response);
            if (response.message === "success") {
              localStorage.setItem("_token", response.token)
              this._Router.navigate(['/home'])
            }
        }, 
        error:(err)=>{
          this.errMsg = err.error.message
          
        }
      })
    }
  }

  

}
