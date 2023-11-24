import {  listener,Subjects,expirationCompleteEvent,OrderStatus,publisher} from "@ateftickets/common";
import {  Message} from "node-nats-streaming";
import {queueGroupName  } from "./queue-group-name";
import {  Order} from "../../models/order";
import { Error } from "mongoose";
import {  OrderCreatedPublisher} from "../publisher/order-created-publisher";

export class expirationCompleteListener extends listener<expirationCompleteEvent>{
queueGroupName=queueGroupName
subject:Subjects.expirationComplete=Subjects.expirationComplete
async onMessage(data: expirationCompleteEvent['data'], msg: Message) {
    
  const order=await Order.findById(data.orderId).populate('ticket')

  if(!order){
    throw new Error('order not found')
  }

  order.set({
    status:OrderStatus.Cancelled
  })
  await order.save()

await new OrderCreatedPublisher(this.Client).publish({
id:order.id,
version:order.version,
ticket:{
  id:order.ticket.id,

}
})

msg.ack()
}

}