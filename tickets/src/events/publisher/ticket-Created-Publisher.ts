import { publisher,Subjects,TicketCreatedEvent } from "@ateftickets/common";

export class TicketCreatedPublisher extends publisher<TicketCreatedEvent>{
  subject:Subjects.TicketCreated = Subjects.TicketCreated
}