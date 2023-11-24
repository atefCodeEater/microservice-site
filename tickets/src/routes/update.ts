import express,{Request,Response  } from "express";
import {Ticket} from "../model/ticket";
import { requireAuth,NotFoundError,NotAuthorizedError,validateRequest,BadRequestError } from "@ateftickets/common";
import { body} from "express-validator";
import {  natsWrapper} from "../nats-wrapper";
import {  TicketUpdatedPublisher} from "../events/publisher/ticket-Updated-Publisher";

const router = express.Router()

router.put("/api/tickets/:id",requireAuth,
[
  body("title")
  .not()
  .isEmpty()
  .withMessage("عنوان بلیط وارد نشده است"),
  body("price")
  .isFloat({gt:0})
  .withMessage("مبلغ بلیط باید بیشتر از 0 باشد")
],
validateRequest,
async(req:Request,res:Response)=>{

const ticket = await Ticket.findById(req.params.id)

if(!ticket){
  throw new NotFoundError()
}
res.send(ticket)

if(ticket.userId !== req.currentUser!.id){
  throw new NotAuthorizedError()
}
if(ticket.orderid){
  throw new BadRequestError('can not update a reserve ticket')
}
 
ticket.set({
  title:req.body.title,
  price:req.body.price,

})

await ticket.save()

new TicketUpdatedPublisher(natsWrapper.client).publish({
  id:ticket.id,
  title:ticket.title,
  price:ticket.price,
  userId:ticket.userId,
  version:ticket.version
})
})


export {router as updateTicketRouter}