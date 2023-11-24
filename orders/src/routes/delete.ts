import express,{Request ,Response } from "express";
import {Order,OrderStatus  } from "../models/order";
import {  requireAuth,NotFoundError,NotAuthorizedError} from "@ateftickets/common";
import {  OrderCancelledEvent} from "@ateftickets/common";
import {  natsWrapper} from "../nats-wrapper";
import { OrderCancelledPublisher } from "../events/publisher/order-cancelled-publisher";

const router = express.Router()

router.delete('/api/orders/:orderId',requireAuth,async(req:Request,res:Response)=>{


  const {orderId}=req.params

  const order = await Order.findById(orderId).populate('ticket')

  if(!order){
    throw new NotFoundError()
  }

  if(order.userId !== req.currentUser!.id){
    throw  new NotAuthorizedError()
  }

  order.status=OrderStatus.Cancelled

  await order.save()

  res.status(204).send(order)

  new OrderCancelledPublisher(natsWrapper.client).publish({
    id:order.id,
    version:order.version,
    ticket:{
      id:order.ticket.id,
    }
  })
})

export {router as deleteOrderRouter}