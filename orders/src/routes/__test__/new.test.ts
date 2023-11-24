import request from "supertest";
import mongoose from "mongoose";
import {  app} from "../../app";
import {  Order, OrderStatus} from "../../models/order";
import {  Ticket} from "../../models/ticket";
import {  natsWrapper} from "../../nats-wrapper";


it('return an error if the ticket does not exist',async()=>{

  const ticketId = new mongoose.Types.ObjectId()

  await request(app)
  .post('/api/orders')
  .set("Cookie",global.signin())
  .send({
    ticketId
  })
  .expect(404)
})

it('return an error if the ticket is already reserved',async()=>{


  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:12,
    title:'concert'

  })
  await ticket.save()
const order = Order.build({
      userId:"gddgdfg",
      status:OrderStatus.Created,
      expiresAt:new Date(),
      ticket
      
    })

    await order.save()
 
await request(app)
.post('/api/orders')
.set('Cookie',global.signin())
.send({ticketId:ticket.id})
.expect(400)   
})

it('reserve a ticket',async()=>{

  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:12,
    title:"concert"
  })
  
  await request(app)
  .post('/api/orders')
  .set("Cookie",global.signin())
  .send({ticketId:ticket.id})
  .expect(201 )
})

it('emt order events',async()=>{
  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:12,
    title:"concert"
  })
  
  await request(app)
  .post('/api/orders')
  .set("Cookie",global.signin())
  .send({ticketId:ticket.id})
  .expect(201)


  expect(natsWrapper.client.publish).toHaveBeenCalled()
}) 