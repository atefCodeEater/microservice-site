import request from "supertest";
import mongoose from "mongoose";
import {  app} from "../../app";
import {  Order, OrderStatus} from "../../models/order";
import {  Ticket} from "../../models/ticket";

const BuidTicket =async()=>{

  const ticket = await Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:12,
    title:"metalica"
  })
  return ticket
}


it('fetches orders for an particular user',async()=>{

  const TicketOne=await BuidTicket()
  const TicketTwo=await BuidTicket()
  const TicketThree=await BuidTicket()

  const UserOne= global.signin()
  const UserTwo= global.signin()


await request(app)
.post('/api/orders')
.set("Cookie",UserOne)
.send({ticketId:TicketOne.id})
.expect(201)

const {body:orderOne}=await request(app)
.post('/api/orders')
.set("Cookie",UserTwo)
.send({ticketId:TicketTwo.id})
.expect(201)


const {body:orderTwo}=await request(app)
.post('/api/orders')
.set("Cookie",UserTwo)
.send({ticketId:TicketThree.id})
.expect(201)

const response = await request(app)
.get('/api/orders')
.set("Cookie",UserTwo)
.expect(200)

expect(response.body.length).toEqual(2)
expect(response.body[0].id).toEqual(orderOne.id)
expect(response.body[1].id).toEqual(orderTwo.id)



})