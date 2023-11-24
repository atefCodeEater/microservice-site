import {  listener,OrderCreatedEvent,Subjects} from "@ateftickets/common";
import {  queueGroupName} from "../../queue-group-name/queueGroupName";
import {  Message} from "node-nats-streaming";
import {  Ticket} from "../../model/ticket";
import {  TicketUpdatedPublisher} from "../publisher/ticket-Updated-Publisher";

export class OrderCreatedListener extends listener<OrderCreatedEvent>{

  subject: Subjects.OrderCreated=Subjects.OrderCreated

  queueGroupName=queueGroupName

  async onMessage(data:OrderCreatedEvent['data'],msg:Message){

const ticket = await Ticket.findById(data.ticket.id)

if(!ticket){
  throw new Error('ticket not found')

}

 ticket.set({orderid:data.id})

await ticket.save()

await new TicketUpdatedPublisher(this.Client).publish({
  id:ticket.id,
  price:ticket.price,
  title:ticket.title,
  userId:ticket.userId,
  orderId:ticket.orderid,
  version:ticket.version
})
msg.ack()
     
  }


}