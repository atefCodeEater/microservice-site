import request from "supertest";
import {  app} from "../../app";
import {Order  } from "../../models/order";
import {  Ticket} from "../../models/ticket";
import {  OrderStatus} from "@ateftickets/common";
import { cookie } from "express-validator";
import { natsWrapper } from "../../nats-wrapper";
import mongoose from "mongoose";



it('turn order status to canceled',async()=>{


  const ticket = await Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:23,
    title:"emibnem"
  })

  await ticket.save()


const user = global.signin()
  const {body:order} = await request(app)
  .post(`/api/orders`)
  .set('Cookie',user)
  .send({ticketId:ticket.id})
  .expect(201)


await request(app)
  .delete(`/api/orders/${order.id}`)
  .set("Cookie",user)
  .send()
  .expect(204)

  const updatedOrder = await Order.findById(order.id)

  expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled)
})

it('delete order emit event Publish',async()=>{

  const ticket = await Ticket.build({
    id:new mongoose.Types.ObjectId().toHexString(),
    price:23,
    title:"emibnem"
  })

  await ticket.save()


const user = global.signin()
  const {body:order} = await request(app)
  .post(`/api/orders`)
  .set('Cookie',user)
  .send({ticketId:ticket.id})
  .expect(201)


await request(app)
  .delete(`/api/orders/${order.id}`)
  .set("Cookie",user)
  .send()
  .expect(204)

  expect(natsWrapper.client.publish).toHaveBeenCalled()
})