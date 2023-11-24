import nats,{Stan,Message} from "node-nats-streaming";
import {Subjects} from "./subjects";


interface Events {

  subject:Subjects,
  data: any

}

 export abstract class listener <T extends Events > {

  abstract subject :T['subject']
  abstract onMessage(data:T['data'],msg:Message) :void
  abstract queueGroupName : string
  protected ackWait = 5*1000
  protected Client :Stan

  constructor(Client :Stan){
    this.Client =Client

  }

  subscriptionOptions(){

    return this.Client
  .subscriptionOptions()
  .setDeliverAllAvailable()
  .setManualAckMode(true)
  .setAckWait(this.ackWait)
  .setDurableName(this.queueGroupName)
  }

  listen (){
    const subscription =this.Client.subscribe(this.subject,this.queueGroupName,this.subscriptionOptions()) 
 
    subscription.on('message',(msg:Message)=>{

      console.log(`Message recieved: ${this.subject} / ${this.queueGroupName}`);

      const parseData =  this.parseMessage(msg)
      this.onMessage(parseData,msg)
    })
  }

  parseMessage(msg:Message){

    const data = msg.getData()

    return typeof data ==="string" ? JSON.parse(data) : JSON.parse(data.toString('utf8'))

  }

}