import nats from "node-nats-streaming";

import {ticketCreatedPublisher} from "./events/ticket-created-Publisher";


console.clear()

const stan = nats.connect("ticketing","abc",{
  url:"http://localhost:4222"
})

stan.on('connect',async()=>{

      console.log('Publisher connected to NATS');

      const publisher = new ticketCreatedPublisher(stan)
      
  try {


  await publisher.publish({
    id:"1234",
    price:12,
    title:"asd"
  })

  } catch (err) {
    console.log(err);
  }

//   const data =JSON.stringify( {
//     id:123,
//     title:"atef",
//     price:20
//   })

// stan.publish("ticket:created",data,()=>{
//   console.log("Event published")
// })

})
