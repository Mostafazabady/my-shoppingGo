import { Injectable } from '@angular/core';
import { CartService } from './cart.service';
import { WishlistService } from './wishlist.service';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class SharedFunAddService {

  constructor(private _CartService:CartService, private WishlistService:WishlistService,private _ToastrService:ToastrService) { }





    addTocart(id:string) {
    this._CartService.addToCart(id).subscribe({
      next:(response: any)=>{
      this._CartService.cartCount.set(response.numOfCartItems);
            this._ToastrService.success(response.message);
        console.log(response);
      }
    })
  }




  addToWishlist(id:string) {
    this.WishlistService.addToWishlist(id).subscribe({
      next:(response: any)=>{
                    this._ToastrService.success(response.message);
        console.log(response);
        
      }
    })
  }




}
