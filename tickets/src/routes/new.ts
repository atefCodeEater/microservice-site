import express,{Request,Response  } from "express";
import { requireAuth,validateRequest } from "@ateftickets/common";
import { body} from "express-validator";
import {  Ticket} from "../model/ticket";
import {  TicketCreatedPublisher} from "../events/publisher/ticket-Created-Publisher";
import {  natsWrapper} from "../nats-wrapper";

const router =express.Router()

router.post("/api/tickets",requireAuth,[
  body("title")
  .not()
  .isEmpty()
  .withMessage("عنوان بلیط وارد نشده است"),
  body("price")
  .isFloat({gt:0})
  .withMessage("مبلغ بلیط باید بیشتر از 0 باشد")
],validateRequest,async(req:Request,res:Response)=>{

const {title,price}=req.body

const tickets=Ticket.build({
  title,
  price,
  userId:req.currentUser!.id

})
await tickets.save()
await new TicketCreatedPublisher(natsWrapper.client).publish({
  id:tickets.id,
  price:tickets.price,
  userId:tickets.userId,
  title:tickets.title,
  version:tickets.version
})
res.status(201).send(tickets)
})

export {router as createTicketRouter}