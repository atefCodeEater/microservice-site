import {  listener,OrderCreatedEvent,Subjects} from "@ateftickets/common";
import { OrderStatus } from "@ateftickets/common/build/events/types/order-status";
import { Message } from "node-nats-streaming";
import {expirationQueue} from "../../queues/expiration-queues";

export class OrderCreatedListener extends listener<OrderCreatedEvent>{
  queueGroupName = "expiration-service"
  subject: Subjects.OrderCreated=Subjects.OrderCreated
 async onMessage(data:OrderCreatedEvent['data'] , msg: Message) {

  const delay =new Date(data.expiresAt).getTime() - new Date().getTime()
      await expirationQueue.add({orderId: data.id},{delay})
      msg.ack()
  }


}