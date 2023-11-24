import {listener  } from "./base-listener";
import {Message} from "node-nats-streaming";
import {TicketCreatedEvent} from "./TicketCreatedEvent";
import {Subjects} from "./subjects";



export class TicketCreatedListener extends listener<TicketCreatedEvent> {

  subject :Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = 'payment-service'
  
  onMessage(data :TicketCreatedEvent["data"],msg : Message){
  console.log('Event data' , data);
  
  msg.ack()
  }
  }