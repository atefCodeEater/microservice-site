import { listener,OrderCancelledEvent ,Subjects} from "@ateftickets/common";
import {  Message} from "node-nats-streaming";
import {  natsWrapper} from "../../nats-wrapper";
import {  queueGroupName} from "../../queue-group-name/queueGroupName";
import { TicketUpdatedPublisher } from "../publisher/ticket-Updated-Publisher";
import {Ticket  } from "../../model/ticket";


export class OrderCancellListener extends listener <OrderCancelledEvent>{
subject: Subjects.OrderCancelled=Subjects.OrderCancelled
queueGroupName=queueGroupName
  async onMessage(data: OrderCancelledEvent['data'], msg: Message) {
    
  const ticket = await Ticket.findById(data.ticket.id)

  if(!ticket){
    throw new Error('ticket not found')
  }

  ticket.set({orderId:undefined})

  await ticket.save()

  await new TicketUpdatedPublisher(this.Client).publish({
    version: ticket.version, 
    id: ticket.id, 
    title: ticket.title, 
    price: ticket.price ,
    userId: ticket.userId, 
    orderId:ticket.orderid
  })
msg.ack()
}
}