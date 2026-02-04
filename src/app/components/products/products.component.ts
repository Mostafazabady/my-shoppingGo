import { Component, ElementRef, OnInit, QueryList, ViewChildren } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule, RouterLink } from '@angular/router';
import { NgxPaginationModule } from 'ngx-pagination';
import { ApiDataService } from 'src/app/Services/api-data.service';
import { CuttextPipe } from 'src/app/Pipes/cuttext.pipe';
import { CartService } from 'src/app/Services/cart.service';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, HttpClientModule, NgxPaginationModule, FormsModule, CuttextPipe, RouterModule, CarouselModule, RouterLink],
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  constructor(private _ApiDataService: ApiDataService, private _CartService: CartService, private WishlistService: WishlistService, private _ToastrService: ToastrService) { }

  allProducts: any[] = [];
  displayedProducts: any[] = [];
  pageSize: number = 12;
  currentPage: number = 1;
  pages: number[] = [];
  loadingCart: { [key: string]: boolean } = {};
  loadingWish: { [key: string]: boolean } = {};

  titles: string[] = [
    'Economize',
    'Our Products',
    'Discounts',
    'Everything',
    'Best Deals',
    'Hot Offers'
  ];


  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: true,
    touchDrag: true,
    pullDrag: true,
    dots: true,
    autoplay: true,
    navSpeed: 700,
    navText: [],
    items: 1,
    nav: false
  }

  ngOnInit(): void {
    this._ApiDataService.getProudect().subscribe({
      next: (response) => {
        this.allProducts = response.data;
        this.generatePageNumbers();
        this.updateDisplay();
      },
      error: (err) => console.error(err)
    });
  }

  generatePageNumbers() {
    const totalPages = Math.ceil(this.allProducts.length / this.pageSize);
    this.pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  updateDisplay() {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.displayedProducts = this.allProducts.slice(startIndex, endIndex);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.pages.length) {
      this.currentPage = page;
      this.updateDisplay();
    }
  }





  addTocart(id: string) {
    this.loadingCart[id] = true;
    this._CartService.addToCart(id).subscribe({
      next: (response) => {
        this._CartService.cartCount.set(response.numOfCartItems);
        this._ToastrService.success(response.message);
        this.loadingCart[id] = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingCart[id] = false;
      }
    });
  }
  addToWishlist(id: string) {
    this.loadingWish[id] = true;
    this.WishlistService.addToWishlist(id).subscribe({
      next: (response) => {
        this._ToastrService.success(response.message);
        this.loadingWish[id] = false;
      },
      error: (err) => {
        console.error(err);
        this.loadingWish[id] = false;
      }
    });
  }




}
