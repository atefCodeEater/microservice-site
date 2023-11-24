import mongoose from "mongoose";
import {  Ticket} from "../../../models/ticket";
import { natsWrapper } from "../../../nats-wrapper";
import {  TicketUpdatedEvent} from "@ateftickets/common";
import {  TicketUpdatedListener} from "../ticket-updated-listener";
import {Message} from "node-nats-streaming";


const setup=async()=>{
  const listener = new TicketUpdatedListener(natsWrapper.client)

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title:"concert",
    price:20,
     
  })
  await ticket.save()

  const data:TicketUpdatedEvent['data'] = {

    id: new mongoose.Types.ObjectId().toHexString(),
    version: ticket.version + 1,
    title:" new concert",
    price:120,  
    userId:"fgdg"
  }
//@ts-ignore  to make sure ts no worry about msg variables that we do nt use them

const msg :Message ={
  ack:jest.fn()
}
return {msg,data,listener,ticket}
}


it('update the ticket',async()=>{
  // fake event
const {listener,data,ticket,msg} = await setup()

  // call onmessage
await listener.onMessage(data,msg)

const updatedTicket = await Ticket.findById(ticket.id)

// make sure ticket updated
expect(updatedTicket!.title).toEqual(data.title)
expect(updatedTicket!.price).toEqual(data.price)
expect(updatedTicket!.version).toEqual(data.version)

})

it('ack the message',async()=>{
  // fake event
const {listener,data,ticket,msg} = await setup()

await listener.onMessage(data,msg)

expect(msg.ack).toHaveBeenCalled()
})

it('version controll',async()=>{
  // fake event
const {listener,data,ticket,msg} = await setup()

data.version=10

try {
  
  await listener.onMessage(data,msg)
} catch (error) {
  
}

expect(msg.ack).not.toHaveBeenCalled() 
})