import { Injectable } from '@angular/core';
import { IsLoggedInService } from './is-logged-in.service';
import { User } from '../Models/user.interface';
import { OnlineUser } from '../Models/Online-User.interface';
import {Observable} from "rxjs";
import {map,shareReplay} from "rxjs/operators";
import {HttpClient,HttpHeaders} from "@angular/common/http";
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root'
})
export class UsersApiService {

  url:String=environment.baseUrl;

  constructor(private http:HttpClient,private isloggedInService:IsLoggedInService) { }



  loadAllUsers(): Observable<any> {
    const httpOption = {
      headers: new HttpHeaders({

        'Authorization': this.isloggedInService.getToken()
      }),
    };
    return this.http.get<any>(this.url+'/User/getAllUseres',httpOption)
      .pipe(map((res:any)=>{
        console.log(res);


        return res;
      }));


  }

  deleteUser(Id:any):Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({

        'Authorization': this.isloggedInService.getToken()
      }),
    };
    return this.http.delete(this.url+'/User/deleteUser/'+Id,httpOption)
}

updateUser(Id:any,User:any):Observable<any>{
  const httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.isloggedInService.getToken()
    }),
  };
  return this.http.patch(this.url+'/User/UpdateUser/'+Id,User,httpOption)
}



updateUserAsLoggedOut(Id:any):Observable<any>{
  const httpOption = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.isloggedInService.getToken()
    }),
  };
  return this.http.patch(this.url+'/User/UpdateLoggedOut/' + Id, httpOption);
}


}
