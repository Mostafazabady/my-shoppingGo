import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { CartService } from 'src/app/Services/cart.service'; // عشان نقدر نضيف للكارت
import { trigger, transition, style, animate, query, stagger } from '@angular/animations';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Product {
  id: string;
  title: string;
  price: number;
  imageCover: string;
  ratingsAverage: number;
  category: { name: string };
}

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss'],
  animations: [
    // 1. انيميشن دخول الصفحة (Grid Entrance)
    trigger('gridAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(50, [
            animate('500ms cubic-bezier(0.35, 0, 0.25, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true }),
        // 2. انيميشن الحذف (Item Removal)
        query(':leave', [
          animate('400ms ease-in', style({ opacity: 0, transform: 'scale(0.8)' }))
        ], { optional: true })
      ])
    ])
  ]
})
export class WishlistComponent implements OnInit {
  wishlistProducts: Product[] = [];
  isLoading: boolean = true;

  constructor(
    private _WishlistService: WishlistService,
    private _CartService: CartService,
    private _ToastrService:ToastrService
  ) {}

  ngOnInit(): void {
    this.loadWishlist();
  }

  loadWishlist() {
    this.isLoading = true;
    this._WishlistService.getWishlist().subscribe({
      next: (res) => {
        this.wishlistProducts = res.data;
        this.isLoading = false;
      },
      error: (err) => {
        console.log(err);
        this.isLoading = false;
      }
    });
  }

  removeItem(id: string) {
    // نقوم بحذف العنصر من المصفوفة فوراً ليعطي انطباع بالسرعة (Optimistic UI)
    const oldList = this.wishlistProducts;
    this.wishlistProducts = this.wishlistProducts.filter(item => item.id !== id);

    this._WishlistService.removeFromWishlist(id).subscribe({
      next: (res) => {
        // تم الحذف بنجاح من السيرفر
        // هنا ممكن تظهر Toast Message
      },
      error: (err) => {
        // لو حصل خطأ نرجع القائمة زي ما كانت
        this.wishlistProducts = oldList;
        console.log(err);
      }
    });
  }

  addToCart(id: string) {
    this._CartService.addToCart(id).subscribe({
      next: (res:any) => {
              this._CartService.cartCount.set(res.numOfCartItems);
        console.log('Added to Cart', res);
        this._ToastrService.success(res.message)
        this.removeItem(id);
      }
    });
  }
}