import {  expirationCompleteListener} from "../expiration-Complete-Listener";
import {  natsWrapper} from "../../../nats-wrapper";
import {  Order, OrderStatus} from "../../../models/order";
import {  Ticket} from "../../../models/ticket";
import mongoose from "mongoose";
import { Message} from "node-nats-streaming";
import {  expirationCompleteEvent} from "@ateftickets/common";
import { OrderCreatedPublisher } from "../../publisher/order-created-publisher";
import { OrderCancelledPublisher } from "../../publisher/order-cancelled-publisher";

const setup=async()=>{

  const ticket =  Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:12,
    title:"concert"
  })

  await ticket.save()
  const order = Order.build({ 
   status:OrderStatus.Created,
   userId:"asdas",
   expiresAt:new Date(),
   ticket
  })
await order.save()
  const listener = new expirationCompleteListener(natsWrapper.client)

  const data:expirationCompleteEvent['data']={
    orderId:order.id
  }
//@ts-ignore
const msg:Message={
  ack:jest.mock()
}
return {ticket,listener,order,msg,data }
}

it('change order status to order cancelled',async()=>{
  const {ticket,listener,order,msg,data}=await setup()

 await listener.onMessage(data,msg)

 const updatedOrder = await Order.findById(order.id)
  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)

})

it('make shore event ordercancelled was published',async()=>{
  const {ticket,listener,order,msg,data}=await setup()

 await listener.onMessage(data,msg)

const eventData=JSON.parse(natsWrapper.client.publish as jest.Mock).mock.calls[0][1]

expect(eventData.id).toEqual(order.id)
})

