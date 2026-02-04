import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from 'src/app/Services/cart.service';

@Component({
  selector: 'app-navbar-blank',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './navbar-blank.component.html',
  styleUrls: ['./navbar-blank.component.scss']
})
export class NavbarBlankComponent {
  constructor( private _CartService:CartService,  private _Router:Router){}
  count = this._CartService.cartCount;

  signOut() {
    localStorage.removeItem('_token');
    this._Router.navigate(['./login']);
  }
}