import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { User } from '../Models/user.interface';
import { OnlineUser } from '../Models/Online-User.interface';
import { ServerApiService } from './server-api.service';
import { IsLoggedInService } from './is-logged-in.service';
import { BehaviorSubject, catchError, EMPTY, map, Subject, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {
  private loggedInUser = new BehaviorSubject<User>({} as User);
  private register_Url="https://rt-dev.xyz:3063/api/register";
  private login_Url="https://rt-dev.xyz:3063/api/login"
  token: string = '';
  isLoggedIn:any;
  userName:String="";

  numberSelected:number=-1;
  onlineUsersArr:OnlineUser[]=[];
  user:any;

  constructor(private api: ServerApiService, private isLoggedInService: IsLoggedInService,private http:HttpClient) { }




  login(user: any) {
    return this.isLoggedInService.login(JSON.stringify(user)).pipe(
      tap((res: any) => this.isLoggedInService.setToken(res.token)),
      tap((res: any) => this.isLoggedInService.setLogIn(true)),
      tap((res: any) => this.mapUserResponse(res.user)),
      map((res: any) => res.user),
      catchError(err => {
        console.log(err);
        return EMPTY;
      })
    );
  }

  private mapUserResponse(user: any) {
    user.photo = user.file;
    this.loggedInUser.next(user);
  }

  register(user: any, callback: any) {
    this.isLoggedInService.register(JSON.stringify(user)).subscribe(
      (res: any) => {
        callback(false, res);
      },
      (err) => {
        callback(err, null);
      }
    );
  }

  getLoggedInUser(): BehaviorSubject<User> {
    return this.loggedInUser;
  }


    setLOggedInUser(user:any){
      this.loggedInUser=user;
    }




  getNumberSelected():number{
     return this.numberSelected;
  }

  setNumberSelected(num:number){
    this.numberSelected=num;
  }



}
