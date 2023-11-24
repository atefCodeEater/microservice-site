import {  publisher,Subjects,OrderCreatedEvent} from "@ateftickets/common";

export class OrderCreatedPublisher extends publisher<OrderCreatedEvent>{
  
subject: Subjects.OrderCreated = Subjects.OrderCreated

}