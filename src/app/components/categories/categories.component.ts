import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ApiDataService } from 'src/app/Services/api-data.service';
import { Category, SubCategory } from 'src/app/interfaces/apps';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { SharedFunAddService } from 'src/app/Services/shared-fun-add.service';
import { ToastrService } from 'ngx-toastr';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss'],
  animations: [
    trigger('listAnimation', [
      transition('* => *', [
        query(':enter', [
          style({ opacity: 0, transform: 'translateY(20px)' }),
          stagger(50, [
            animate('300ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
          ])
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

export class CategoriesComponent implements OnInit {

  selectedSubId: string | null = null;
  allCategories: Category[] = [];
  currentCategory?: Category;
  subCategories: SubCategory[] = [];
  loadingAll: boolean = true;
  loadingSub: boolean = false;
  showModal: boolean = false;
  products: any[] = [];
  loadingSubs: boolean = false;
  loadingProducts: boolean = false;
  private detroy$ = new Subject<void>()

  constructor(private _api: ApiDataService, private _router: Router, private _SharedFunAddService: SharedFunAddService, private _ToastrService: ToastrService) { }

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData() {
    this._api.getAllCategories().pipe(takeUntil(this.detroy$)).subscribe({
      next: (res) => {
        this.allCategories = res.data;
        if (this.allCategories.length > 0) {
          this.onCategoryClick(this.allCategories[0]._id);
        }
        this.loadingAll = false;
      }
    });
  }

  onCategoryClick(id: string) {
    this.loadingSub = true;
    this._api.getSpecificCategory(id).pipe(takeUntil(this.detroy$)).subscribe(res => {
      this.currentCategory = res.data;
    });
    this._api.getAllSubCategoriesOnCategory(id).pipe(takeUntil(this.detroy$)).subscribe({
      next: (res) => {
        this.subCategories = res.data;
        this.loadingSub = false;
      },
      error: () => this.loadingSub = false
    });
  }

  goToProducts(subId: string) {
    this._router.navigate(['/products', subId]);
  }



  openProducts(subId: string) {
    this.showModal = true;
    this.loadingProducts = true;
    this.products = [];
    this._api.getProductsBySub(subId).pipe(takeUntil(this.detroy$)).subscribe({
      next: (res) => {
        this.products = res.data;
        console.log(this.products);
        this.loadingProducts = false;
      },
      error: (err) => {
        console.log(err);
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
