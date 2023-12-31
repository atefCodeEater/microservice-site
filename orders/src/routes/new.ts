import express,{Request ,Response } from "express";
import { requireAuth,validateRequest } from "@ateftickets/common";
import { NotFoundError ,OrderStatus,BadRequestError} from "@ateftickets/common";
import { OrderCreatedPublisher } from "../events/publisher/order-created-publisher";
import { natsWrapper } from "../nats-wrapper";

import {  body} from "express-validator";
import {  Ticket} from "../models/ticket";
import {  Order} from "../models/order";

const EXPIRATION_WINDOW_SECOND = 15*60

const router = express.Router()

router.post('/api/orders',requireAuth,[
  body("ticketId")
  .not()
  .isEmpty()
  .withMessage(" Ticket id must provided") 
],validateRequest,async(req:Request,res:Response)=>{

const {ticketId}=req.body
  const ticket = await Ticket.findById(ticketId)
if(!ticket){
  throw new NotFoundError()
}


const isReserved = await ticket.isReserved()
if(isReserved){
  throw new BadRequestError('تیکت قبلا رزرو شده است')
}

const expiration = new Date()
expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECOND)

const order = Order.build({
  userId:req.currentUser!.id,
  status: OrderStatus.Created,
  expiresAt:expiration,
  ticket
})

await order.save()

new OrderCreatedPublisher(natsWrapper.client).publish({
  id:order.id,
  version:order.version,
  status:order.status,
  userId:order.userId,
  expiresAt: order.expiresAt.toISOString(),
  ticket:{
    id:ticket.id,
    price:ticket.price
  }
})

res.status(201).send(order)

})


export {router as newOrderRouter}  