// payment.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CartService } from 'src/app/Services/cart.service';
import { ActivatedRoute } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {
  cartId: string | null = '';
  isLoading: boolean = false;
  private detroy$ = new Subject<void>()

  constructor(
    private _FormBuilder: FormBuilder, 
    private _CartService: CartService, 
    private _ActivatedRoute: ActivatedRoute
  ) {}

  checkForm: FormGroup = this._FormBuilder.group({
    details: ['', [Validators.required, Validators.minLength(3)]],
    phone: ['', [Validators.required, Validators.pattern(/^01[0125][0-9]{8}$/)]],
    city: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this._ActivatedRoute.paramMap.pipe(takeUntil(this.detroy$)).subscribe({
      next: (params) => {
        this.cartId = params.get('id');
      }
    });
  }

  handleForm(): void {
    if (this.checkForm.valid) {
      this.isLoading = true;
      this._CartService.checkOut(this.cartId!, this.checkForm.value).pipe(takeUntil(this.detroy$)).subscribe({
        next: (response) => {
          this.isLoading = false;
          if (response.status === 'success') {
            window.open(response.response.session.url);
          }
        },
        error: (err) => {
          this.isLoading = false;
          console.error(err);
        }
      });
    }
  }


    ngOnDestroy(): void {
    this.detroy$.next()
    this.detroy$.complete() 
  }




}