import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { AuthService } from 'src/app/Services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { ForgetPasswordService } from 'src/app/Services/forget-password.service';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  animations: [
    trigger('fadeSlide', [
      transition(':enter', [

        animate('500s ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ opacity: 0, transform: 'translateY(-20px)' }))
      ])
    ])
  ]
})
export class ProfileComponent implements OnInit {

  userImage: string = './assets/images/avatar.webp';
  isDark: boolean = false;
  step1: boolean = true;
  step2: boolean = false;
  step3: boolean = false;
  email: string = '';
  isLoading: boolean = false;
  private detroy$ = new Subject<void>()

  constructor(
    private _AuthService: AuthService,
    private _ToastrService: ToastrService,
    private _ForgetPasswordService: ForgetPasswordService,
    private _Router: Router
  ) { }

  ngOnInit() {
    this.isDark = localStorage.getItem('theme') === 'dark';

    const savedImg = localStorage.getItem('userImage');
    if (savedImg) {
      this.userImage = savedImg;
    }
  }

  toggleDarkMode() {
    this.isDark = !this.isDark;
    localStorage.setItem('theme', this.isDark ? 'dark' : 'light');
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.userImage = e.target.result;
        localStorage.setItem('userImage', this.userImage);
        this._ToastrService.info('Profile picture updated locally! 📸');
      };
      reader.readAsDataURL(file);
    }
  }

  forgetForm: FormGroup = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email])
  });

  resetCodeForm: FormGroup = new FormGroup({
    resetCode: new FormControl('', [Validators.required])
  });

  resetPassword: FormGroup = new FormGroup({
    newPassword: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  forgetPassword(): void {
    if (this.forgetForm.valid) {
      this.isLoading = true;
      this._ForgetPasswordService.forgetPassword(this.forgetForm.value).pipe(takeUntil(this.detroy$)).subscribe({
        next: (response) => {
          this._ToastrService.success(response.message || 'Reset code sent to your email!');
          this.email = this.forgetForm.value.email;
          this.step1 = false;
          setTimeout(() => this.step2 = true, 400);
          this.isLoading = false;
        },
        error: (err) => {
          this._ToastrService.error(err.error.message);
          this.isLoading = false;
        }
      });
    }
  }

  resetCode(): void {
    if (this.resetCodeForm.valid) {
      this._ForgetPasswordService.resetCode(this.resetCodeForm.value).pipe(takeUntil(this.detroy$)).subscribe({
        next: (response) => {
          this._ToastrService.success('Code Verified! Set your new password.');
          this.step2 = false;
          setTimeout(() => this.step3 = true, 400);
        },
        error: (err) => this._ToastrService.error(err.error.message)
      });
    }
  }

  newPassword(): void {
    if (this.resetPassword.valid) {
      let resetForm = this.resetPassword.value;
      resetForm.email = this.email;
      this._ForgetPasswordService.newPassword(resetForm).pipe(takeUntil(this.detroy$)).subscribe({
        next: (response) => {
          if (response.token) {
            localStorage.setItem('_token', response.token);
            this._ToastrService.success('Password updated! Redirecting...');
            setTimeout(() => this._Router.navigate(['/home']), 1500);
          }
        },
        error: (err) => this._ToastrService.error(err.error.message)
      });
    }
  }









      ngOnDestroy(): void {
    this.detroy$.next()
    this.detroy$.complete() 
  }




}