import { Injectable } from '@angular/core';

import { IsLoggedInService } from './is-logged-in.service';


import {Observable} from "rxjs";
import {map,shareReplay} from "rxjs/operators";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OrdersService {

  url:String=environment.baseUrl;
  constructor(private http:HttpClient,private isloggedInService:IsLoggedInService) { }



  addOrder(Order:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.isloggedInService.getToken()
      }),
    };
    return this.http.post(this.url+'/Order/addOrder', Order, httpOption);
  }

  loadAllOrders(): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({

        'Authorization': this.isloggedInService.getToken()
      }),
    };
    return this.http.get<any>(this.url+'/Order/getAllOrders',httpOption)
      .pipe(map((res:any)=>{
        console.log(res);


        return res;
      }));


  }

  loadOrdersByUser(UserEmail:String): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({

        'Authorization': this.isloggedInService.getToken()
      }),
    };
    return this.http.get<any>(this.url+'/Order/getOrdersByUser/'+UserEmail,httpOption)
      .pipe(map((res:any)=>{
        console.log(res);


        return res;
      }));


  }


  deleteOrder(Id:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({

        'Authorization': this.isloggedInService.getToken()
      }),
    };
    console.log(Id);
    return this.http.delete(this.url+'/Order/deleteOrderById/' + Id, httpOption);
  }


  updateOrder(Id:any,Order:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.isloggedInService.getToken()
      }),
    };
    console.log(Id,Order);
    return this.http.patch(this.url+'/Order/updateOrderById/' + Id,Order, httpOption);
  }



}




