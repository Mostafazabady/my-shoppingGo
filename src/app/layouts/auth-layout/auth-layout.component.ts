import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarAuthComponent } from "src/app/components/navbar-auth/navbar-auth.component";
import { RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [CommonModule, NavbarAuthComponent, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.scss']
})
export class AuthLayoutComponent {

}
