import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder, FormGroupDirective,NgForm} from '@angular/forms';
import { MessagessService } from '../Services/messagess.service';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.css']
})
export class ContactUsComponent implements OnInit {

  formData:any;
  companyEmail:String="";
  fname:String="";
  lname:String="";
  phone:String="";
  companyPhone:String="";
  guestMessage:String="";
  constructor(private messagesService:MessagessService) { }

  ngOnInit(): void {
    this.formData=new FormGroup({
      companyEmail:new FormControl('', Validators.compose([Validators.required,Validators.email])),
      fname: new FormControl('',[Validators.pattern("[\- a-zA-Zא-ת\s]+$"), Validators.required]),
      lname: new FormControl('',[Validators.pattern("[\- a-zA-Zא-ת\s]+$"), Validators.required]),
      phone: new FormControl('',[Validators.pattern("[0-9]{9,10}"),Validators.required]),
      companyPhone: new FormControl('',[Validators.pattern("[0-9]{9,10}"),Validators.required]),
      guestMessage:new FormControl('',Validators.required)
     })

  }


  onClickSubmit(data:any) {
    console.log(data);
    this.companyEmail=data.companyEmail;
    this.fname=data.fname;
    this.lname=data.lname;
    this.phone=data.phone;
    this.companyPhone=data.companyPhone;
    this.guestMessage=data.guestMessage;

    console.log(this.companyEmail,this.fname,this.lname,this.phone,this.companyPhone);

    let guestMessage={
      companyEmail:this.companyEmail,
      fname:this.fname,
      lname:this.lname,
      phone:this.phone,
      companyPhone:this.companyPhone,
      guestMessage:this.guestMessage,
    }

    console.log(guestMessage);

    this.messagesService.addGuestMessage(guestMessage).subscribe((res:any)=>{


        console.log(res);
    })
  }


}
