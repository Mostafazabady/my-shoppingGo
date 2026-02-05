import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss']
})
export class AllordersComponent implements OnInit {
  orders: any[] = [];

  private detroy$ = new Subject<void>()
  
  
  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._http.get('https://ecommerce.routemisr.com/api/v1/orders/').pipe(takeUntil(this.detroy$)).subscribe({
      next: (res: any) => {
        this.orders = res;
        console.log(this.orders);
      }
    });
  }



    ngOnDestroy(): void {
    this.detroy$.next()
    this.detroy$.complete() 
  }


}
