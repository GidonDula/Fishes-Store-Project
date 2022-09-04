import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { UsersService } from './users.service';
import { UsersApiService } from './users-api.service';
import { Message, SocketMessage } from '../Models/Message.interface';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  userA: any;
  userB:any;
  userConnected:any;
  connectedUserFullName:String='';
  onlineUser:any;
  onlineUsers:any[]=[];
  loggedInUsers:any[]=[];

  constructor( private socket: Socket,
    private userService:UsersService,private userApi:UsersApiService) { }

    initSocket(): void {
      this.socket.on("user",(users:any)=>{
        console.log(users);
        this.onlineUsers.push(users);
          })
    }



  setConnectedUser(user: any) {
    this.socket.emit("user connected",user);
    this.userConnected = this.userService.getLoggedInUser().getValue();
    console.log(this.userConnected.email);
    this.connectedUserFullName=this.userConnected.fname+" "+this.userConnected.lname;
    console.log(this.connectedUserFullName);
  }
  getConnectedUser() {
    console.log(this.onlineUsers);
    return this.onlineUsers;
  }




  setLoggedOutUser(){
    console.log("disconnect",this.socket.ioSocket.id);
    console.log(this.onlineUsers);
    if(this.onlineUsers.length>0){
      this.onlineUsers = this.onlineUsers.filter(user => user.id !== this.socket.ioSocket.id);
    }
    console.log(this.onlineUsers);
    this.socket.emit("disconnectedUser",this.socket.ioSocket.id);
  }

  sendPrivateMessage(message:any,id:any){
    console.log("private send"+message,id);
    let SentMessage={
      user:this.connectedUserFullName,
      mess:message
    }
    console.log(SentMessage);
    this.socket.emit("privateMessage",id,SentMessage);
  }

  getPrivateMessage(){
    return new Observable((observer)=>{
      this.socket.on("private-message",(ans:Message)=>{
        console.log("getting answer"+ans);
        let message = new SocketMessage(ans,this.connectedUserFullName);
        console.log(this.socket,ans);
        console.log(this.socket,ans);
        console.log(this.userB);
        console.log(this.userA);
        console.log("getting message"+message.userA,message.userB,message.message);
        observer.next(message);
      })
    })
  }

  sendMessage(message:any){
    console.log(message);
    let SentMessage={
      user:this.connectedUserFullName,
      mess:message
    }
    console.log(SentMessage);
     this.socket.emit("new-message",SentMessage);
  }

  getMessage(){
    return new Observable((observer)=>{
      this.socket.on("answer",(ans:Message)=>{
        console.log(ans);
        let message = new SocketMessage(ans,this.connectedUserFullName);
        console.log(this.socket,ans);
        console.log(this.userA);
        console.log(message);
        observer.next(message);
      })
    })
  }

  findUserId(id:any,date:Date){
    console.log(id);
    for(let i=0; i<this.onlineUsers.length; i++){
      console.log(this.onlineUsers[i]);
      const user = this.onlineUsers[i].find((user: any) => user.user._id === id);
      if(user) {
        return user.id;
      }
    }

    }
  }


