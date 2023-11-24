import {  Subjects} from "./subjects";
import {TicketCreatedEvent} from "./TicketCreatedEvent";
import {  publisher} from "./base-publisher";



export class ticketCreatedPublisher extends publisher<TicketCreatedEvent>{

subject: Subjects.TicketCreated=Subjects.TicketCreated

}
