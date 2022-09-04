import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';



@Injectable({
  providedIn: 'root'
})
export class IsLoggedInService {
  private loggedIn$ = new BehaviorSubject<boolean>(false);
  token: string = '';
  url:String=environment.baseUrl;

  constructor(private http:HttpClient) { }

  setLogIn(loggedIn: boolean) {
    return this.loggedIn$.next(loggedIn);
  }
  getLogin() {
    return this.loggedIn$.asObservable();
  }
  getToken() {
    console.log('getToken', this.token);
    return this.token;
  }
  setToken(token: any): void {
    return (this.token = token);
  }

  register(data: string) {
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      }),
    };
    return this.http.post(this.url+'/User/sign_up', data, httpOption);
  }

  login(data: string) {
    console.log(data);
    const httpOption = {
      headers: new HttpHeaders({ 'content-Type': 'application/json' }),
    };
    return this.http.post(this.url+'/User/login', data, httpOption);
  }


}
