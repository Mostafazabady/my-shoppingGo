import { Component, OnInit,QueryList,ViewChildren,ElementRef, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ApiDataService } from 'src/app/Services/api-data.service';
import { HttpClientModule } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { CuttextPipe } from 'src/app/Pipes/cuttext.pipe';
import { RouterLink, RouterModule } from '@angular/router';
import { OwlOptions, CarouselModule } from 'ngx-owl-carousel-o';
import { CartService } from 'src/app/Services/cart.service';
import { WishlistService } from 'src/app/Services/wishlist.service';
import { ToastrService } from 'ngx-toastr';
import { trigger, transition, query, style, stagger, animate } from '@angular/animations';
import { Subject, takeUntil } from 'rxjs';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,HttpClientModule,NgxPaginationModule,FormsModule,CuttextPipe,RouterModule,CarouselModule,RouterLink],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
export class HomeComponent implements OnInit {

private detroy$ = new Subject<void>()

constructor(private _ApiDataService:ApiDataService, private _CartService:CartService, private WishlistService:WishlistService, private _ToastrService:ToastrService){}

products:any[]= [];
loadingCart: { [key: string]: boolean } = {};
loadingWish: { [key: string]: boolean } = {}; 

currdeg: number = 0;
  isDragging: boolean = false;
  startX: number = 0;
  prevDeg: number = 0;
images: string[] = [
    './assets/images/man1.webp',
    './assets/images/man2.webp',
    './assets/images/man3.webp',
    './assets/images/woman1.webp',
    './assets/images/woman2.webp',
    './assets/images/woman3.webp',
  ];

ngOnInit(): void {
  this._ApiDataService.getProudect().pipe(takeUntil(this.detroy$)).subscribe({
    next: (response) => {
      this.products = response.data.slice(0, 15)
      console.log(response.data);
      
    },
      error: (err) => console.error(err)
  });
}




addTocart(id: string) {
  this.loadingCart[id] = true;
  this._CartService.addToCart(id).pipe(takeUntil(this.detroy$)).subscribe({
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
  this.WishlistService.addToWishlist(id).pipe(takeUntil(this.detroy$)).subscribe({
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






    @ViewChildren('counter')
  counters!: QueryList<ElementRef<HTMLElement>>;
  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            this.startCounter(entry.target as HTMLElement);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    this.counters.forEach(counter =>
      observer.observe(counter.nativeElement)
    );
  }

  startCounter(counter: HTMLElement) {
    const target = Number(counter.dataset['target']);
    const speed = 200;

    const update = () => {
      const current = Number(counter.innerText);
      const increment = Math.ceil(target / speed);

      if (current < target) {
        counter.innerText = String(current + increment);
        requestAnimationFrame(update);
      } else {
        counter.innerText = String(target);
      }
    };

    update();
  }



onMouseDown(e: MouseEvent) {
    this.isDragging = true;
    this.startX = e.clientX;
  }

  onMouseMove(e: MouseEvent) {
    if (!this.isDragging) return;
    this.rotateLogic(e.clientX);
  }

  onMouseUp() {
    this.isDragging = false;
    this.prevDeg = this.currdeg;
  }

  // --- التعامل مع اللمس (للموبايل) ---
  onTouchStart(e: TouchEvent) {
    this.isDragging = true;
    this.startX = e.touches[0].clientX;
  }

  onTouchMove(e: TouchEvent) {
    if (!this.isDragging) return;
    this.rotateLogic(e.touches[0].clientX);
  }

  onTouchEnd() {
    this.isDragging = false;
    this.prevDeg = this.currdeg;
  }

  // المنطق المشترك للحساب
  rotateLogic(currentX: number) {
    const deltaX = currentX - this.startX;
    // (0.5) هي سرعة الدوران، ممكن تزودها لو عايزه أسرع
    this.currdeg = this.prevDeg - (deltaX * 0.5); 
  }



  ngOnDestroy(): void {
    this.detroy$.next()
    this.detroy$.complete() 
  }



}
