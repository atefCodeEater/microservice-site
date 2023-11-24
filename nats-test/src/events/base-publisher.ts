import {Stan} from "node-nats-streaming";
import {Subjects} from "./subjects";

interface Event {
  subject:Subjects.TicketCreated,
  data :any
}

export abstract class publisher <T extends Event>{
abstract subject :T['subject']
private Client :Stan
constructor (Client:Stan){
this.Client=Client
}

publish(data:T['data']):Promise<void>{

  return new Promise((resolve,reject)=>{

     this.Client.publish(this.subject,JSON.stringify(data),(err)=>{
      if(err){
        return reject(err)
      }
    console.log('Event published');
    resolve()
  })
 
  })
}
}