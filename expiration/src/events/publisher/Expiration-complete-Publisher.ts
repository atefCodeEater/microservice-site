import {  Subjects,publisher,expirationCompleteEvent} from "@ateftickets/common";

export class expirationCompletePublisher extends Publisher<expirationCompleteEvent>{
  Subjects:Subjects.expirationComplete=Subjects.expirationComplete
}