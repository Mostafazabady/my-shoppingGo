import { Routes, CanActivateFn } from '@angular/router';
import { authGuard } from './guards/auth.guard';


export const routes: Routes = [
    {path:"", loadComponent: ()=>import('./layouts/blank-layout/blank-layout.component').then((m)=> m.BlankLayoutComponent), children:[
    {path:"", redirectTo:'home', pathMatch:'full'},
    {path:"home",canActivate: [authGuard], loadComponent: ()=>import('./components/home/home.component').then((m)=> m.HomeComponent)},
    {path:"categories",canActivate: [authGuard],    loadComponent: ()=>import('./components/categories/categories.component').then((m)=> m.CategoriesComponent)},
    {path:"brands", canActivate: [authGuard],   loadComponent: ()=>import('./components/brands/brands.component').then((m)=> m.BrandsComponent)},
    {path:"products",  canActivate: [authGuard],  loadComponent: ()=>import('./components/products/products.component').then((m)=> m.ProductsComponent)},
    {path:"payment/:id", canActivate: [authGuard],   loadComponent: ()=>import('./components/payment/payment.component').then((m)=> m.PaymentComponent)},
    {path:"cart", canActivate: [authGuard],   loadComponent: ()=>import('./components/cart/cart.component').then((m)=> m.CartComponent)},
    {path:"allorders", canActivate: [authGuard],   loadComponent: ()=>import('./components/allorders/allorders.component').then((m)=> m.AllordersComponent)},
    {path:"contact", canActivate: [authGuard],   loadComponent: ()=>import('./components/contact-us/contact-us.component').then((m)=> m.ContactUsComponent)},
    {path:"profile", canActivate: [authGuard],   loadComponent: ()=>import('./components/profile/profile.component').then((m)=> m.ProfileComponent)},
    {path:"wishlist",  canActivate: [authGuard],  loadComponent: ()=>import('./components/wishlist/wishlist.component').then((m)=> m.WishlistComponent)},
    {path:"productDetails/:id", canActivate: [authGuard],   loadComponent: ()=>import('./components/product-details/product-details.component').then((m)=> m.ProductDetailsComponent)},
]},
{path:"", loadComponent: ()=>import('./layouts/auth-layout/auth-layout.component').then((m)=> m.AuthLayoutComponent), children:[
    {path:"login", loadComponent: ()=>import('./components/login/login.component').then((m)=> m.LoginComponent)},
    {path:"Register", loadComponent: ()=>import('./components/register/register.component').then((m)=> m.RegisterComponent)},
    {path:"profiles",  loadComponent: ()=>import('./components/profile/profile.component').then((m)=> m.ProfileComponent)},
    
    ]},
    
    {path:"**", loadComponent: ()=>import('./components/notfound/notfound.component').then((m)=> m.NotfoundComponent)},
];

