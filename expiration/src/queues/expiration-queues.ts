import Queue from "bull";
import {expirationCompletePublisher  } from "../../src/events/publisher/Expiration-complete-Publisher";
import {  natsWrapper} from "../nats-wrapper";

interface PayLoad{
  orderId:string 
}

const expirationQueue = new Queue<PayLoad>('order:expiration',{
  redis:{
    host:process.env.REDIS_HOST
  }
})

expirationQueue.process(async(job)=>{
  

  new expirationCompletePublisher(natsWrapper.client).publish({
    orderId:job.data.orderId
  })
})

export{expirationQueue}