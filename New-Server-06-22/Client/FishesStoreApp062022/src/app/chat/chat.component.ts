import { Component, OnInit } from '@angular/core';

import { Message } from '../Models/Message.interface';
import { UsersService } from '../Services/users.service';
import { SocketService } from '../Services/socket.service';
import { MessagessService } from '../Services/messagess.service';
import { Socket } from 'ngx-socket-io';
import { UsersApiService } from '../Services/users-api.service';
import { IsLoggedInService } from '../Services/is-logged-in.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {



  user:any;
  socketId:any;
  otherSocketId:any;
  users:any[]=[];

  Messagesender:any;
  MessagesResiver:any;
  chatMesssages:Message[]=[];
  selectedUser:any;
  outMessage:String="";
  userId:boolean=false;
  selectedUserId:any;
  selectedUserEmail:String="";
  selectedUserFullName:String="";
  connectedUsers:any[]=[];
  date:Date=new Date();

  constructor(private userService:UsersService,private socketService:SocketService,private messageService:MessagessService,private socket:Socket,private userApi:UsersApiService,private isloggedInService:IsLoggedInService,private router:Router) { }

  displayColumns: string[] = ['Id','fname','lname','email','phone','address','ZipCode','Photo','Role','dateAdded','delete','Select For Private Message'];
  ngOnInit(): void {
    if(this.isloggedInService.getToken()!==' '){
    this.user = this.userService.getLoggedInUser().getValue();
    this.connectedUsers=this.socketService.getConnectedUser();
    console.log("connected Users"+this.connectedUsers);
    let userFullName=this.user.fname+" "+this.user.lname
     this.loadMessagesFromDB(userFullName);
    this.socketService.getMessage().subscribe((ans:any)=>{
      console.log(ans);
      this.chatMesssages.push(ans);
    });

    this.socketService.getPrivateMessage().subscribe((ans:any)=>{
      console.log(ans);
      this.chatMesssages.push(ans);
    });

   this.loadOnlineUsers();
   console.log(this.date);
  }
   else{
    this.router.navigate(['/login']);
   }




  }

  deleteMessages(fname:String,lname:String){
    let userFullName=fname+" "+lname
    this.messageService.deleteMessagesForSender(userFullName).subscribe((res)=>{

      console.log(res);
    })
    this.messageService.deleteMessagesForResiver(userFullName).subscribe((res)=>{

      console.log(res);
    })
 }

 selectForPrivateMessage(user: any){

   if(this.user._id===user._id){
     console.log("you selected on yourself Id please select on another user");
   }else{
     this.selectedUserId = user._id;
     this.selectedUserEmail= user.email;
     this.selectedUserFullName=user.fname+" "+user.lname;
     console.log(user);
     this.otherSocketId=this.socketService.findUserId(user._id,this.date);
     console.log(this.otherSocketId);
     this.userId=true;
   }
   this.outMessage="";

 }

 newMessage():void{
   console.log(this.outMessage);
    this.socketService.sendMessage(this.outMessage);
    let userFullName=this.user.fname+" "+this.user.lname
    let newmessage={
      userA:userFullName,
      userB:'',
      message:this.outMessage,
      time:new Date()
    }
    console.log(newmessage);
    this.messageService.addMessage(newmessage).subscribe((res:any)=>{


      console.log(res);
    })
    this.outMessage="";
 }

 privateMessage(){
   this.socketService.sendPrivateMessage(this.outMessage,this.otherSocketId);
   let userFullName=this.user.fname+" "+this.user.lname;
   let newMessage={
     userA:userFullName,
     userB:this.selectedUserFullName,
     message:this.outMessage,
     time:new Date()
   }
   console.log("to DB"+newMessage);
   this.messageService.addMessage(newMessage).subscribe((res:any)=>{

     console.log(res);
   })
   this.userId=false;
   this.outMessage="";
 }

 private loadOnlineUsers(){

  this.userApi.loadAllUsers().subscribe((res)=>{
    this.users=res;
    console.log(this.users);

    this.users = this.users.filter(user => user.online === true);
  })

 }

private loadMessagesFromDB(FullName:String){
   this.messageService.getMessagesForSender(FullName).subscribe((res:any)=>{
     this.Messagesender=res
   });
   this.messageService.getMessagesForResiver(FullName).subscribe((res:any)=>{
     this.MessagesResiver=res;
   })
}

}
