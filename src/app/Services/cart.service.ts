import { HttpClient } from '@angular/common/http';
import { Injectable, signal, computed } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  constructor(private _HttpClient: HttpClient) {
    if (localStorage.getItem('_token')) {
      this.getCart().subscribe({
        next: (res) => this.cartCount.set(res.numOfCartItems),
        error: (err) => console.log(err)
      });
    }
  }

  cartCount = signal<number>(0);

  myHeaders: any = {
    token: localStorage.getItem('_token')
  }

  baseUrl: string = `https://ecommerce.routemisr.com/api/v1/cart`

  addToCart(id: string): Observable<any> {
    return this._HttpClient.post(this.baseUrl, { productId: id }, { headers: this.myHeaders })
  }

  getCart(): Observable<any> {
    return this._HttpClient.get(this.baseUrl, { headers: this.myHeaders })
  }

  removeSpecificCartItem(itemId: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${itemId}`, { headers: this.myHeaders });
  }

  clearCart(): Observable<any> {
    return this._HttpClient.delete(this.baseUrl, { headers: this.myHeaders });
  }

  updateItemCount(itemId: string, count: number): Observable<any> {
    return this._HttpClient.put(`${this.baseUrl}/${itemId}`, { count: count }, { headers: this.myHeaders });
  }

  checkOut(cart_id: string, orderDetails: object): Observable<any> {
    return this._HttpClient.post(`https://ecommerce.routemisr.com/api/v1/orders/checkout-session/${cart_id}?url=http://localhost:4200`,
      { shippingAddress: orderDetails },
      { headers: this.myHeaders }
    );
  }
}