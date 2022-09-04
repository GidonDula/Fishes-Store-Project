import { Component, OnInit } from '@angular/core';
import { UsersService } from '../Services/users.service';
import { UsersApiService } from '../Services/users-api.service';
import { MessagessService } from '../Services/messagess.service';
import { User } from '../Models/user.interface';
import { Router } from '@angular/router';
import { IsLoggedInService } from '../Services/is-logged-in.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  UsersArr:any;
  numberSelected!:number;
  user:any;
  IsAdmin:boolean=false;
  constructor(private userService:UsersService,private router:Router,private messagesService:MessagessService,private usersApi:UsersApiService, private isloggedInService:IsLoggedInService) { }

  displayColumns: string[] = ['Id','fname','lname','email','phone','address','ZipCode','Photo','Role','dateAdded','delete','Update'];
  ngOnInit(): void {
    if(this.isloggedInService.getToken()!==' '){
      this.user = this.userService.getLoggedInUser().getValue();
      this.IsAdmin=this.user.role==="Admin";
    if(this.IsAdmin){
      this.loadUsers();
    }
    else{
      console.log("the user isn't admin so navigte to profile");
      this.router.navigate(['/profile']);
    }
    }
    else{
      this.router.navigate(['/login']);
    }
  }

  delete(Id:any,fname:String,lname:String){
    let userFullName=fname+" "+lname
    this.messagesService.deleteMessagesForSender(userFullName).subscribe((res)=>{

      console.log(res);
    })
    this.messagesService.deleteMessagesForResiver(userFullName).subscribe((res)=>{

      console.log(res);
    })
    this.usersApi.deleteUser(Id).subscribe((res)=>{

     console.log(res);
     this.loadUsers();
    })
  }


  update(id:any){
    for(let i=0; i<this.UsersArr.length; i++){
      if(this.UsersArr[i]._id===id){
        this.numberSelected=i;
      }
    }
   this.userService.setNumberSelected(this.numberSelected);
   this.router.navigate(['/updateUser'])
  }

  private loadUsers(){
    this.usersApi.loadAllUsers().subscribe((res:any)=>{
      this.UsersArr=res;
    });
  }

}
