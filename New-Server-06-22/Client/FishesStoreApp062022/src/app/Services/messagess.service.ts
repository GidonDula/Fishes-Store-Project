import { Injectable } from '@angular/core';

import { IsLoggedInService } from './is-logged-in.service';
import {Observable} from "rxjs";
import {map,shareReplay} from "rxjs/operators";

import {HttpClient,HttpHeaders} from "@angular/common/http";
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MessagessService {

  url:String=environment.baseUrl;
  constructor(private http:HttpClient,private isloggedInService:IsLoggedInService) { }


  addGuestMessage(Message:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(this.url+'/User/guestMessage',Message,httpOption);
  }

  addMessage(Message:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': this.isloggedInService.getToken()
      }),
    };
    return this.http.post(this.url+'/User/newMessage',Message,httpOption);
 }

 getMessagesForSender(user:String):Observable<any>{
  const httpOption = {
    headers: new HttpHeaders({

      'Authorization': this.isloggedInService.getToken()
    }),
  };
  return this.http.get<any>(this.url+'/User/getMessagesForSender/'+user,httpOption) .pipe(map((res:any)=>{
    console.log(res);


    return res;
  }));
 }
 getMessagesForResiver(user:String):Observable<any>{
  const httpOption = {
    headers: new HttpHeaders({

      'Authorization': this.isloggedInService.getToken()
    }),
  };
  return this.http.get<any>(this.url+'/User/getMessagesForResiver/'+user,httpOption)
  .pipe(map((res:any)=>{
    console.log(res);


    return res;
  }));


 }

 deleteMessagesForSender(User:String):Observable<any>{
  const httpOption = {
    headers: new HttpHeaders({

      'Authorization': this.isloggedInService.getToken()
    }),
  };
  return this.http.delete(this.url+'/User/deleteMessagesForSender/'+User,httpOption);
 }

 deleteMessagesForResiver(User:String):Observable<any>{
  const httpOption = {
    headers: new HttpHeaders({

      'Authorization': this.isloggedInService.getToken()
    }),
  };
  return this.http.delete(this.url+'/User/deleteMessagesForResiver/'+User,httpOption);
 }
}
