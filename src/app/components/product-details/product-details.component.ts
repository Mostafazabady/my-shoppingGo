import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiDataService } from 'src/app/Services/api-data.service';
import { CuttextPipe } from 'src/app/Pipes/cuttext.pipe';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { SharedFunAddService } from 'src/app/Services/shared-fun-add.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-product-details',
  standalone: true,
  imports: [CommonModule, CuttextPipe, CarouselModule, RouterLink],
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  [x: string]: any;
  private detroy$ = new Subject<void>()

  constructor(private _ActivatedRoute: ActivatedRoute, private _ApiDataService: ApiDataService, private _SharedFunAddService: SharedFunAddService) { }
isLoading: boolean = true;
  productId!: string;
  productDetails: any = null;
  productDetailsImages: string[] = [];
  currentImageIndex: number = 0;
  isGalleryOpen: boolean = false;

  ngOnInit(): void {
    this.isLoading = true;
    this._ActivatedRoute.paramMap.pipe(takeUntil(this.detroy$)).subscribe({
      next: (params) => {
        this.productId = params.get('id')!;

        this._ApiDataService.prductDetails(this.productId).pipe(takeUntil(this.detroy$)).subscribe({
          next: (response) => {
            this.productDetails = response.data;
            this.productDetailsImages = response.data.images.slice(0, 5);
            this.isLoading = false;
          },
          error: (err) => console.error(err)
        });
      }
    });
  }


  openGallery(index: number) {
    this.currentImageIndex = index;
    this.isGalleryOpen = true;
  }

  closeGallery() {
    this.isGalleryOpen = false;
  }

  nextImage() {
    this.currentImageIndex =
      (this.currentImageIndex + 1) % this.productDetailsImages.length;
  }

  prevImage() {
    this.currentImageIndex =
      (this.currentImageIndex - 1 + this.productDetailsImages.length) %
      this.productDetailsImages.length;
  }




  productSlider: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: false,
    autoplay: true,
    navSpeed: 700,
    navText: ['', ''],
    responsive: {
      0: {
        items: 1
      },
      400: {
        items: 1
      },
      740: {
        items: 1
      },
      940: {
        items: 1
      }
    },
    nav: true
  }



  addToCart() {
    this._SharedFunAddService.addTocart(this.productId)

  }
  addToWishList() {
    this._SharedFunAddService.addToWishlist(this.productId)
  }




  
    ngOnDestroy(): void {
    this.detroy$.next()
    this.detroy$.complete() 
  }




}
