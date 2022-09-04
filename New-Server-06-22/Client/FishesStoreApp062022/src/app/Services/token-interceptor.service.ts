import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { IsLoggedInService } from './is-logged-in.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService {

  private register_Url="https://rt-dev.xyz:3063/api/register";
  private login_Url="https://rt-dev.xyz:3063/api/login"

  constructor(private isLoggedInService:IsLoggedInService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log(req);
      let tokenizedRequest=req.clone({
        setHeaders:{
          Authorization:'Bearer '+this.isLoggedInService.getToken()
        }
      })
     return next.handle(tokenizedRequest)
  }
}
