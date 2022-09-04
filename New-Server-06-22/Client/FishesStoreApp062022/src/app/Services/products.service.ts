import { Injectable } from '@angular/core';
import { IsLoggedInService } from './is-logged-in.service';
import { Product } from '../Models/product.interface';
import {Observable} from "rxjs";
import {map,shareReplay} from "rxjs/operators";
import { Subject } from 'rxjs';
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {


  url:String=environment.baseUrl;

  constructor(private http:HttpClient,private isloggedInService:IsLoggedInService) { }


  addProduct(Product:Product):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.isloggedInService.getToken()
      }),
    };
    return this.http.post(this.url+'/Product/addProduct', Product, httpOption);
  }

  loadAllProducts(): Observable<any> {
    return this.http.get<any>(this.url+'/Product/getAllProducts')
      .pipe(map((res:any)=>{
        console.log(res);


        return res;
      }));


  }




  deleteProduct(Id:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({

        'Authorization': this.isloggedInService.getToken()
      }),
    };

    return this.http.delete(this.url+'/Product/deleteProduct/' + Id, httpOption);
  }


  updateProduct(Id:any,Product:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.isloggedInService.getToken()
      }),
    };

    return this.http.patch(this.url+'/Product/UpdateProduct/' + Id,Product, httpOption);
  }




}
