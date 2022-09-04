import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import { UsersService } from '../Services/users.service';
import { Router } from '@angular/router';
import { SocketService } from '../Services/socket.service';
import { catchError, EMPTY } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  emailid:string='';
  formdata:any;
  passwd:string="";

  anAuthorized: boolean = false;
  loggedIn: boolean = false;
  constructor(private fb: FormBuilder,
    private usersService: UsersService,
   private router: Router,
   private socketSevice: SocketService) { }

  ngOnInit(): void {
    this.formdata = new FormGroup({
      emailid: new FormControl("", Validators.compose([Validators.required,Validators.email])),
      passwd: new FormControl("", [Validators.required, Validators.minLength(4),Validators.maxLength(10)]),
  });
  }
  onClickSubmit(data:any) {
    console.log(data)
    this.emailid = data.emailid;
    this.passwd=data.passwd;
    let user = {
      email: this.emailid,

      password: this.passwd,
    };
    console.log(user);
   // if (this.emailid.length && this.password.length) {
      this.usersService.login(user).pipe(
        catchError(err => {
          this.emailid = this.passwd = '';
          this.anAuthorized = true;
          console.log('not authorized');
          return EMPTY;
        })
      ).subscribe(res => {
        this.emailid = this.passwd = '';
        this.socketSevice.setConnectedUser(res);

        this.loggedIn = true;
        this.router.navigate(['/profile']);
      });

  }

  }



