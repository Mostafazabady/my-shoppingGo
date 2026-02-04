import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApiResponse, Category, SubCategory } from '../interfaces/apps';


@Injectable({
  providedIn: 'root'
})
export class ApiDataService {

  constructor(private _HttpClient:HttpClient) { }

  private catUrl = 'https://ecommerce.routemisr.com/api/v1/categories';
  private subCatUrl = 'https://ecommerce.routemisr.com/api/v1/subcategories';

private baseUrl = 'https://ecommerce.routemisr.com/api/v1';

  getProudect():Observable<any> {
    return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/products')
  }

  
  prductDetails(id:any):Observable<any> {
    return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products/${id}`)
  }


  getAllCategories(): Observable<ApiResponse<Category>> {
    return this._HttpClient.get<ApiResponse<Category>>(`${this.baseUrl}/categories`);
  }


  getAllSubCategoriesOnCategory(catId: string): Observable<ApiResponse<SubCategory>> {
    return this._HttpClient.get<ApiResponse<SubCategory>>(`${this.baseUrl}/categories/${catId}/subcategories`);
  }

  getSpecificCategory(catId: string): Observable<{ data: Category }> {
    return this._HttpClient.get<{ data: Category }>(`${this.baseUrl}/categories/${catId}`);
  }

  getProductsBySub(subId: string): Observable<any> {
  return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?subcategory[in]=${subId}`);
}


getAllBrands(): Observable<any> {
  return this._HttpClient.get('https://ecommerce.routemisr.com/api/v1/brands');
}

getSpecificBrand(brandId: string): Observable<any> {
  return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/brands/${brandId}`);
}

getProductsByBrand(brandId: string): Observable<any> {
  return this._HttpClient.get(`https://ecommerce.routemisr.com/api/v1/products?brand=${brandId}`);
}







}
