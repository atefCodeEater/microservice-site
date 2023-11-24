import mongoose from "mongoose";
import {  Ticket} from "../ticket";

it("implement cconcurency controll",async()=>{

const ticket = await Ticket.build({
  title:"concert",
  price:21,
  userId:'gffg'
})
//version 0
await ticket.save()

const firstTicket = await Ticket.findById(ticket.id)   //version 0
const secondTicket = await Ticket.findById(ticket.id)  //version 0

await firstTicket!.set({price:32})
await secondTicket!.set({price:76})

await firstTicket!.save()

//version 1


await secondTicket!.save()
 
})

it('increment version when update',async()=>{

  const ticket = await  Ticket.build({
    price:12,
    title:"sport",
  userId:'gffg'

  })

  await ticket.save()

  expect(ticket.version).toEqual(0)

  await ticket.save()

  expect(ticket.version).toEqual(1)

  await ticket.save()

  expect(ticket.version).toEqual(2)
})

