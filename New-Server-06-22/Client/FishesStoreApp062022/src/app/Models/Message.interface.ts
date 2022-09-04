export interface Message{
  userA:String;
  userB:String
  message:String;
  time:Date;
}

export class SocketMessage implements Message{
  message:String="";
  time: Date;
  userA:String="";
  userB:String="";
  constructor(message:any,UserName:String){
    const answer=JSON.parse(message);
    console.log(answer);
    this.message=answer.message;
    if(UserName===answer.userA) this.userA=UserName;
    else this.userA=answer.userA;
    this.time=new Date();
  }
}
