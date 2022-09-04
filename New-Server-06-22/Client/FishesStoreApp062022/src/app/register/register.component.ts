import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective,NgForm} from '@angular/forms';
import { UsersService } from '../Services/users.service';
import { IsLoggedInService } from '../Services/is-logged-in.service';
import { Router } from '@angular/router';


interface Role {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  emailid:string='';
  formdata:any;
  fname:string='';
  lname:string='';
  phone!:number;
  passwd:string="";
  REpasswd:string="";


  address:string='';
  ZipCode!:number;
  selectedItem:String="";
  Image:any;
  previewUrl:any=null;
  Roles: any[] = [
    {name: 'Customer'},
    {name: 'Admin'},

  ];

  constructor(private fb: FormBuilder,private usersService: UsersService, private router: Router,private isLoggedInService:IsLoggedInService) { }

  ngOnInit(): void {
    this.formdata = new FormGroup({
      emailid: new FormControl("", Validators.compose([Validators.required,Validators.email])),
      passwd: new FormControl("", [Validators.required, Validators.minLength(4),Validators.maxLength(12)]),
      REpasswd: new FormControl("",[Validators.required,Validators.minLength(4),Validators.maxLength(12)]),
      fname: new FormControl('',[Validators.pattern("[\- a-zA-Zא-ת\s]+$"), Validators.required]),
      lname: new FormControl('',[Validators.pattern("[\- a-zA-Zא-ת\s]+$"), Validators.required]),
      phone: new FormControl('',[Validators.pattern("[0-9]{9,10}"),Validators.required]),


      address:new FormControl('',Validators.required),

      ZipCode:new FormControl('',[Validators.required,Validators.maxLength(9)]),
      Image:new FormControl('',Validators.required),
     selectedItem:new FormControl()



    });


  }

  fileProgress(fileInput: any) {
    this.Image = <File>fileInput.target.files[0];
    if (this.Image) {
      const reader = new FileReader();
      reader.readAsDataURL(this.Image);
      reader.onload = (_event) => {
        this.previewUrl = reader.result;
        console.log(this.previewUrl);
        console.log(this.previewUrl.length);
      }
    }
  }

  onClickSubmit(data:any) {

    console.log(data)
    this.emailid = data.emailid;
    this.fname = data.fname;
    this.lname = data.lname;
    this.phone = data.phone;
    this.passwd=data.passwd;
    this.REpasswd=data.REpasswd;


    this.address=data.address;
    this.ZipCode=data.ZipCode;
    this.Image=data.Image;
    this.selectedItem=data.selectedItem;
    let hindex = this.Image.indexOf('h');

    console.log(hindex);
    this.Image = this.Image.substring(hindex + 2, this.Image.length);

    console.log(this.emailid,this.fname,this.lname,this.phone,this.passwd,this.REpasswd,this.address,this.ZipCode,this.Image,this.selectedItem);
   if(this.passwd===this.REpasswd){

    // let base64Img=this.convertToBase64(this.Image);
      //console.log(base64Img);

    let user = {
      fname: this.fname,
      lname: this.lname,
      phone: this.phone,
      email: this.emailid,
      password: this.passwd,


      address:this.address,
      ZipCode:this.ZipCode,
      Image:this.previewUrl,
      Role:this.selectedItem,

    };
     console.log(user);

    this.usersService.register(user, (err: any, res: any) => {
      if (err) {
        console.log(err);
      } else { // everything OK
        console.log(res);
        this.router.navigate(['/login']);
      }
    });
  }
  else{
    console.log("the reEnter Password don't match to real try again in order to register")
  }

  }

}
