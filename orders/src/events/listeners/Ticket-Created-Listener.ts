import { Message } from "node-nats-streaming";
import { Subjects,listener,TicketCreatedEvent } from "@ateftickets/common";
import { Ticket } from "../../models/ticket";
import {  queueGroupName} from "../listeners/queue-group-name";


export  class TicketCreatedListener extends listener<TicketCreatedEvent> {

   subject: Subjects.TicketCreated = Subjects.TicketCreated
  queueGroupName = queueGroupName;
  async onMessage(data:TicketCreatedEvent['data'],msg:Message){
const {id,price,title}=data
    const ticket = Ticket.build({
      id,
      title,
      price
    })
    await ticket.save()
    msg.ack()
  }
}