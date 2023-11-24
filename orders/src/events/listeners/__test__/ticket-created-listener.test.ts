import mongoose from "mongoose";
import {Message} from "node-nats-streaming";
import {Ticket} from "../../../models/ticket";
import {  TicketCreatedEvent} from "@ateftickets/common";
import {  TicketCreatedListener} from "../../listeners/Ticket-Created-Listener";
import {  natsWrapper} from "../../../nats-wrapper";
const setup = async ()=>{

  // created instance of  the listener
const listener = new TicketCreatedListener(natsWrapper.client)

// created a fake data event

const data:TicketCreatedEvent['data']={
  id: new mongoose.Types.ObjectId().toHexString(),
  title:"concert",
  version:0,
  price:12,
  userId:new mongoose.Types.ObjectId().toHexString()
}

// created a fake nats message
//@ts-ignore  to make sure ts no worry about msg variables that we do nt use them
const msg:Message={
ack:jest.fn()
}
return {listener , data , msg}
}


it('created and saved a ticket',async()=>{

  const {listener,data,msg} = await setup()

  await listener.onMessage(data,msg)

  const ticket = await Ticket.findById(data.id)

  expect(ticket).toBeDefined()
  expect(ticket!.title).toEqual(data.title)
  expect(ticket!.price).toEqual(data.price)

})

it('ack the message',async()=>{
  
  const {listener,data,msg} = await setup()
  await listener.onMessage(data,msg)

expect(msg.ack).toHaveBeenCalled()

})