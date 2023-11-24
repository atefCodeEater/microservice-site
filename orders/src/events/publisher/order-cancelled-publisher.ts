import {  publisher,Subjects,OrderCancelledEvent} from "@ateftickets/common";


export class OrderCancelledPublisher extends publisher<OrderCancelledEvent>{
  
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled 
  
  }

  