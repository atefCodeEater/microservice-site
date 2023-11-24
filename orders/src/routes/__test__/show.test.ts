import request from "supertest";
import {  app} from "../../app";
import {Order  } from "../../models/order";
import {  Ticket} from "../../models/ticket";
import {  OrderStatus} from "@ateftickets/common";
import { cookie } from "express-validator";


it('fetch one order by orderId',async()=>{

  const ticket = Ticket.build({
    price:12,
    title:"concert"
  })

  await  ticket.save()

  const user = global.signin()

  const {body:order}=await request(app)
  .post('/api/orders')
  .set('Cookie',user)
  .send({ticketId:ticket.id})
  .expect(201)

  const {body:fetchOrder}=await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie',user)
  .send()
  expect(200)

  expect(fetchOrder.id).toEqual(order.id)




})



it('fetch an order by anoder user',async()=>{

  const ticket = Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:12,
    title:"concert"
  })

  await  ticket.save()

  const user = global.signin()

  const {body:order}=await request(app)
  .post('/api/orders')
  .set('Cookie',user)
  .send({ticketId:ticket.id})
  .expect(201)

  const {body:fetchOrder}=await request(app)
  .get(`/api/orders/${order.id}`)
  .set('Cookie',global.signin())
  .send()
  expect(401)






})
