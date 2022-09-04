import { Component, OnInit } from '@angular/core';
import { UsersService } from '../Services/users.service';
import { UsersApiService } from '../Services/users-api.service';
import { User } from '../Models/user.interface';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { FormControl } from '@angular/forms';
import { Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IsLoggedInService } from '../Services/is-logged-in.service';
@Component({
  selector: 'app-update-user',
  templateUrl: './update-user.component.html',
  styleUrls: ['./update-user.component.css']
})
export class UpdateUserComponent implements OnInit {

  UsersArr:any;
  selectedNumber:number=-1;
  formdata:any;
  UserId:any;
  email:String="";
  fname:string='';
  lname:string='';
  phone!:number;
  address:string='';
  ZipCode!:number;
  selectedItem:String="";
  tempEmail:String="";
  user:any;
  IsAdmin:boolean=false;
  Image:any;
  previewUrl:any=null;
  Roles: any[] = [
    {name: 'Customer'},
    {name: 'Admin'},

  ];

  constructor(private userService:UsersService,private fb:FormBuilder,private usersApi:UsersApiService,private router:Router,private islogeedInService:IsLoggedInService) { }

  ngOnInit(): void {

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
    if(this.islogeedInService.getToken()!==' '){
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

  private loadUsers(){
    this.usersApi.loadAllUsers().subscribe((res:any)=>{
      this.UsersArr=res;
      this.loadUserDetails();
    });
  }

  private loadUserDetails(){
    this.selectedNumber=this.userService.getNumberSelected();
    console.log(this.selectedNumber);
     this.previewUrl=this.UsersArr[this.selectedNumber].file;
     this.UserId=this.UsersArr[this.selectedNumber]._id;
    this.formdata.patchValue({
      email:this.UsersArr[this.selectedNumber].email,
      fname:this.UsersArr[this.selectedNumber].fname,
      lname:this.UsersArr[this.selectedNumber].lname,
      phone:this.UsersArr[this.selectedNumber].phone,
      address:this.UsersArr[this.selectedNumber].address,
      ZipCode:this.UsersArr[this.selectedNumber].ZipCode,
      Image:this.UsersArr[this.selectedNumber].file,
      selectedItem:this.UsersArr[this.selectedNumber].role
    })
  }


  onClickSubmit(data:any) {
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
     this.usersApi.updateUser(this.UserId,updatedUser).subscribe((res:any)=>{

       console.log(res);
       this.router.navigate(['/User']);
     })


  }

}
