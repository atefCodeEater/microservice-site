import {  Ticket} from "../../../model/ticket";
import {  Message} from "node-nats-streaming";
import {  natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";
import { OrderCancellListener} from "../order-cancelled-listener";
import {  OrderCancelledEvent,} from "@ateftickets/common"

const setup=async()=>{

const ticket = await Ticket.build({
  price:12,
  title:'concert',
  userId:'asde'
})
const orderId=new mongoose.Types.ObjectId().toHexString()
ticket.set({orderId})
await ticket.save()
const listener= new OrderCancellListener(natsWrapper.client)

const data:OrderCancelledEvent['data']={
  id:orderId,
  ticket:{id:ticket.id},
  version:ticket.version
}
//@ts-ignore
const msg:Message={
  ack:jest.fn()
}
return {ticket,data,listener,orderId,msg}
}


it('listen to order created',async()=>{

const {data,listener,msg,orderId,ticket}=await setup()

await listener.onMessage(data,msg)

const updatedTicket=await Ticket.findById(data.ticket.id)
expect(updatedTicket?.orderid).toEqual(undefined)
expect(msg.ack).toHaveBeenCalled()
expect(natsWrapper.client.publish).toHaveBeenCalled()


})  

