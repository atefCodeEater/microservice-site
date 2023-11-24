import { publisher,Subjects,TicketUpdatedEvent } from "@ateftickets/common";

export class TicketUpdatedPublisher extends publisher<TicketUpdatedEvent>{
  subject:Subjects.TicketUpdated = Subjects.TicketUpdated
}