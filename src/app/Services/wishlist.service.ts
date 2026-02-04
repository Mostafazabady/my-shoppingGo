import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class WishlistService {

    constructor(private _HttpClient:HttpClient) { }
       
baseUrl: string = 'https://ecommerce.routemisr.com/api/v1/wishlist';
  
  myHeaders: any = {
    token: localStorage.getItem('_token')
  };
  
    addToWishlist(id:string):Observable<any> {
      return this._HttpClient.post(this.baseUrl,
        {
            productId: id
        },
         {
          headers : this.myHeaders
          
         }   
      )
    }

getWishlist(): Observable<any> {
    return this._HttpClient.get(this.baseUrl, { headers: this.myHeaders });
  }

  removeFromWishlist(id: string): Observable<any> {
    return this._HttpClient.delete(`${this.baseUrl}/${id}`, { headers: this.myHeaders });
  }




}
