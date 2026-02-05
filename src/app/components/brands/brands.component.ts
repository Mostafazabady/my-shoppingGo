import { CartService } from 'src/app/Services/cart.service';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, style, animate, transition, query, stagger } from '@angular/animations';
import { ApiDataService } from 'src/app/Services/api-data.service';
import { RouterLink } from '@angular/router';
import { SharedFunAddService } from 'src/app/Services/shared-fun-add.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-brands',
  animations: [
    trigger('brandsAnim', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(30px)' }),
          stagger(50, [
            animate('400ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
        ], { optional: true })
      ])
    ])
  ],
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './brands.component.html',
  styleUrls: ['./brands.component.scss']
})
export class BrandsComponent implements OnInit {
  brands: any[] = [];
  selectedBrand: any = null;
  isDrawerOpen: boolean = false;
  loading: boolean = true;
  showModal: boolean = false;
  products: any[] = [];
  loadingProducts: boolean = false;
private detroy$ = new Subject<void>()

  constructor(private _api: ApiDataService, private _SharedFunAddService: SharedFunAddService, private _ToastrService: ToastrService, private _CartService: CartService) { }

  ngOnInit(): void {
    this._api.getAllBrands().pipe(takeUntil(this.detroy$)).subscribe({
      next: (res) => {
        this.brands = res.data;
        this.loading = false;
      }
    });
  }

  viewBrandDetails(id: string) {
    this._api.getSpecificBrand(id).pipe(takeUntil(this.detroy$)).subscribe({
      next: (res) => {
        this.selectedBrand = res.data;
        this.isDrawerOpen = true; 
      }
    });
  }



  openBrandProducts(brandId: string) {
    this.showModal = true;
    this.loadingProducts = true;
    this.products = []; 
    this._api.getProductsByBrand(brandId).pipe(takeUntil(this.detroy$)).subscribe({
      next: (res) => {
        this.products = res.data;
        this.loadingProducts = false; 
      },
      error: () => {
        this.loadingProducts = false;
      }
    });
  }

  closeProducts() {
    this.showModal = false;
  }



  addToCart(id: string) {
    this._SharedFunAddService.addTocart(id)

    this._ToastrService.success('product added succesfully to your cart')

  }
  addToWishList(id: any) {
    this._SharedFunAddService.addToWishlist(id)
    this._ToastrService.success('product added succesfully to your wishList')
  }



  
    ngOnDestroy(): void {
    this.detroy$.next()
    this.detroy$.complete() 
  }



}
