import { Component, OnInit } from '@angular/core';
import { UsersService } from '../Services/users.service';
import { User } from '../Models/user.interface';
import { UsersApiService } from '../Services/users-api.service';

import { IsLoggedInService } from '../Services/is-logged-in.service';
import { SocketService } from '../Services/socket.service';
import { Router, Routes } from '@angular/router';
import { Observable, switchMap, tap } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  loggedIn$!: Observable<any>;
  loggedIn: boolean = false;
  IsAdmin:boolean=false;


  conncetedUser: User={number:11,_id:"",fname:"",lname:"",email:"",phone:"",address:"",ZipCode:"",photo:"",role:"",date:new Date()};

  constructor(private usersService: UsersService,
    private isLoggedInService: IsLoggedInService,
    private socketService:SocketService,
    private router: Router,private userApi:UsersApiService) { }

  ngOnInit(): void {
    this.loggedIn$ = this.isLoggedInService.getLogin().pipe(
      tap(response => this.loggedIn = response),
      switchMap(() => this.getConnectedUser())
    );
  }

  private getConnectedUser() {
    return this.usersService.getLoggedInUser().pipe(
      tap(user => this.conncetedUser = user),
      tap(user => this.IsAdmin = user.role==="Admin"),
      tap(() => console.log(this.IsAdmin)),
    );
  }

  setLogOut() {

    this.socketService.setLoggedOutUser();
     let connectedUserId=this.conncetedUser._id;
     this.userApi.updateUserAsLoggedOut(connectedUserId).subscribe((res:any)=>{

       console.log(res);

     }
   );
   this.router.navigate(['/']);
   this.isLoggedInService.setLogIn(false);
   this.isLoggedInService.setToken(' ');





  }

  setConnectedUser(user:User):void{
      this.conncetedUser=user;
  }
  img ="assets/Imperial-Tropicals-logo.jpg"

}
