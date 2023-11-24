import { Message } from "node-nats-streaming";
import { Subjects,listener,TicketUpdatedEvent } from "@ateftickets/common";
import { Ticket } from "../../models/ticket";
import {  queueGroupName} from "../listeners/queue-group-name";


export class TicketUpdatedListener extends listener<TicketUpdatedEvent>{

  subject: Subjects.TicketUpdated=Subjects.TicketUpdated
  queueGroupName = queueGroupName

  async onMessage(data:TicketUpdatedEvent['data'] , msg: Message) {
      
    const ticket = await Ticket.findByEvent(data)

    if(!ticket){
      throw new Error('Ticket not found')
    }
    const {price,title}=data

    ticket.set({title,price})
 
    await ticket.save()

    msg.ack()
  }
}