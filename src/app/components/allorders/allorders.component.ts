import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-allorders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './allorders.component.html',
  styleUrls: ['./allorders.component.scss']
})
export class AllordersComponent implements OnInit {
  orders: any[] = [];
  
  constructor(private _http: HttpClient) {}

  ngOnInit(): void {
    this._http.get('https://ecommerce.routemisr.com/api/v1/orders/').subscribe({
      next: (res: any) => {
        this.orders = res;
        console.log(this.orders);
      }
    });
  }
}
