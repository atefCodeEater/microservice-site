import { Subjects } from "./subjects";

export interface expirationCompleteEvent{
subject:Subjects.expirationComplete

data:{
  orderId:string
}

}