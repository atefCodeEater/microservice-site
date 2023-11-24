
import nats from "node-nats-streaming";
import {TicketCreatedListener  } from "./events/ticket-created listener";



import { randomBytes } from "crypto";
console.clear()

const stan =nats.connect('ticketing',randomBytes(4).toString('hex'),{
  url:"http://localhost:4222"
}) 

stan.on('connect',()=>{
  console.log('listener connected to NATS');
  
  new TicketCreatedListener(stan).listen()
})







   