import {  Ticket} from "../../../model/ticket";
import {  Message} from "node-nats-streaming";
import {  natsWrapper} from "../../../nats-wrapper";
import mongoose from "mongoose";
import {  OrderCreatedListener} from "../order-created-listener";
import {  TicketCreatedEvent,OrderCreatedEvent,OrderStatus} from "@ateftickets/common"

const setup=async()=>{

  const listener = new OrderCreatedListener(natsWrapper.client)


  const ticket =  Ticket.build({
    title:'concert',
    price:12,
    userId:'hgfhf',
  })
  await ticket.save()


const data:OrderCreatedEvent['data'] ={
  status:OrderStatus.Created,
  version:0,
  ticket:{
    id:ticket.id,
    price:12
  },
  id: new mongoose.Types.ObjectId().toHexString(),
  userId:'dfdfs',
  expiresAt:"fsdfsf"
}

 //@ts-ignore
const msg :Message ={
  ack: jest.fn()
}
return {listener,ticket,data,msg}
}


it('listen to order created',async()=>{


const {data,listener,msg,ticket} = await setup()

await listener.onMessage(data,msg)

const updatadTicket = await Ticket.findById(ticket.id)
 
expect(updatadTicket?.orderid).toEqual(data.id)

})  

it('ack the message',async()=>{


  const {data,listener,msg,ticket} = await setup()
  
  await listener.onMessage(data,msg)
  
  expect(msg.ack).toHaveBeenCalled()
  
  })


  it('publishing a ticket updated event',async()=>{


    const {data,listener,msg,ticket} = await setup()
  
     await listener.onMessage(data,msg)

     expect(natsWrapper.client.publish).toHaveBeenCalled()

     const ticketUpdatesData = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1])

     expect(ticketUpdatesData.orderId).toEqual(data.id)

    })