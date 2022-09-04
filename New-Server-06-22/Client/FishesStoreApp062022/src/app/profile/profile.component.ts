import { Component, OnInit } from '@angular/core';

import { SocketService } from '../Services/socket.service';
import { UsersService } from '../Services/users.service';
import { UsersApiService } from '../Services/users-api.service';
import { User } from '../Models/user.interface';
import { IsLoggedInService } from '../Services/is-logged-in.service';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  constructor(private socket: SocketService,   private UsersService: UsersService,private isLogedInService:IsLoggedInService,private userApi:UsersApiService,private fb:FormBuilder, private router:Router) { }

  user: any ;
  online:boolean=false;
  updateColumn:boolean=false;
  formdata:any;
  email:String="";
  fname:string='';
  lname:string='';
  phone!:number;
  address:string='';
  ZipCode!:number;
  selectedItem:String="";
  tempEmail:String="";

  Image:any;
  previewUrl:any=null;
  Roles: any[] = [
    {name: 'Customer'},
    {name: 'Admin'},

  ];


  ngOnInit(): void {

    this.user = this.UsersService.getLoggedInUser().getValue();
    console.log(this.user);
    if(this.isLogedInService.getToken()!==' '){
    console.log(this.isLogedInService.getToken());

    this.formdata = new FormGroup({
      email: new FormControl("", Validators.compose([Validators.required,Validators.email])),
      fname: new FormControl('',[Validators.pattern("[\- a-zA-Zא-ת\s]+$"), Validators.required]),
      lname: new FormControl('',[Validators.pattern("[\- a-zA-Zא-ת\s]+$"), Validators.required]),
      phone: new FormControl('',[Validators.pattern("[0-9]{9,10}"),Validators.required]),


      address:new FormControl('',Validators.required),

      ZipCode:new FormControl('',[Validators.required,Validators.maxLength(9)]),
      Image:new FormControl('',Validators.required),
     selectedItem:new FormControl()


    });

  }
  else{
    this.router.navigate(['/login']);
  }

  }



  fileProgress(fileInput: any) {
    this.Image = <File>fileInput.target.files[0];
    if (this.Image) {
      const reader = new FileReader();
      reader.readAsDataURL(this.Image);
      reader.onload = (_event) => {
        this.previewUrl = reader.result;
        console.log(this.previewUrl);
      }
    }
  }

  update(){
    this.updateColumn=true;
    this.previewUrl=this.user.photo;
    this.formdata.patchValue({
      email:this.user.email,
      fname:this.user.fname,
      lname:this.user.lname,
      phone:this.user.phone,
      address:this.user.address,
      ZipCode:this.user.ZipCode,
      Image:this.user.photo,
      selectedItem:this.user.role
    })
  }

  onClickSubmit(data:any){
    this.email=data.email;
    this.fname=data.fname;
    this.lname=data.lname;
    this.phone=data.phone;
    this.address=data.address;
    this.ZipCode=data.ZipCode;
    this.selectedItem=data.selectedItem;


    let updatedUser:User = {
     fname: this.fname,
     lname: this.lname,
     phone:String (this.phone),
     email: this.email,
     photo:this.previewUrl,
     address:this.address,
     ZipCode:String(this.ZipCode),

     role:this.selectedItem,

   };
    console.log(updatedUser);
    this.userApi.updateUser(this.user._id,updatedUser).subscribe((res:any)=>{

      console.log(res);

    })
  }

}
