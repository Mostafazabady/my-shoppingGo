import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService } from 'src/app/Services/cart.service';
import { RouterLink } from '@angular/router';
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateX(-20px)' }),
          stagger(50, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
          ])
        ], { optional: true }),
        query(':leave', [
          animate('300ms ease-in', style({ opacity: 0, transform: 'translateX(20px)', height: 0 }))
        ], { optional: true })
      ])
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('500ms ease-in', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class CartComponent implements OnInit {
  cartData: any = null;
  isLoading: boolean = true;
  private detroy$ = new Subject<void>()

  constructor(private _CartService: CartService) { }

  ngOnInit(): void {
    this.getCartDetails();
  }

  getCartDetails() {
    this.isLoading = true;
    this._CartService.getCart().pipe(takeUntil(this.detroy$)).subscribe({
      next: (response) => {
        this.cartData = response.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  removeItem(id: string) {
    this._CartService.removeSpecificCartItem(id).pipe(takeUntil(this.detroy$)).subscribe({
      next: (response) => {
        this.cartData = response.data;
        this._CartService.cartCount.set(response.numOfCartItems);
        console.log('Item Removed', response);
      },
      error: (err) => console.log(err)
    });
  }

  clearAllCart() {
    this.isLoading = true;
    this._CartService.clearCart().pipe(takeUntil(this.detroy$)).subscribe({
      next: (response) => {
        if (response.message === "success") {
          this.cartData = null;
          this.isLoading = false;
          this._CartService.cartCount.set(response.numOfCartItems);
        }
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  updateCount(id: string, count: number) {
    if (count > 0) {
      this._CartService.updateItemCount(id, count).pipe(takeUntil(this.detroy$)).subscribe({
        next: (res) => this.cartData = res.data
      });
    }
  }



  
    ngOnDestroy(): void {
    this.detroy$.next()
    this.detroy$.complete() 
  }


}