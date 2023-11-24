import mongoose from "mongoose";
import request from "supertest";
import {app} from "../../app";
import {  natsWrapper} from "../../nats-wrapper";
import { OrderCreatedListener } from "../../events/listener/order-created-listener";
import { Ticket } from "../../model/ticket";


it("require id not exist",async()=>{

  const id=new mongoose.Types.ObjectId().toHexString()

  await request(app)
  .put(`/api/tickets/${id}`)
  .set("Cookie",global.signin())
  .send({
    title:"football",
    price:30
  })
  .expect(404)
})

it("user not autentickated",async()=>{

  const id=new mongoose.Types.ObjectId().toHexString()

  await request(app)
  .put(`/api/tickets/${id}`)
  .send({
    title:"football",
    price:30
  })
  .expect(401)
})

it("user not own ticket",async()=>{
  const response=await request(app)
  .post(`/api/tickets`)
  .set("Cookie",global.signin())
  .send({
    title:"football",
    price:30
  })

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set("Cookie",global.signin())
  .send({
    title:"football",
    price:30
  })
  .expect(401)

})

it("invalid inputs 400  ",async()=>{

const cookie = global.signin()

  const response=await request(app)
  .post(`/api/tickets`)
  .set("Cookie",cookie)
  .send({
    title:"football",
    price:30
  })

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set("Cookie",cookie)
  .send({
    title:"",
    price:30
  })
  .expect(400)

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set("Cookie",cookie)
  .send({
    title:"football",
    price:-30
  })
  .expect(400)

})

it("update the ticket",async()=>{
  const cookie = global.signin()

  const response=await request(app)
  .post(`/api/tickets`)
  .set("Cookie",cookie)
  .send({
    title:"football",
    price:30
  })

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set("Cookie",cookie)
  .send({
    title:"new",
    price:20
  })
  .expect(200)

  const ticketresponse = await request(app)
.get(`/api/tickets/${response.body.id}`)
.send()
expect(ticketresponse.body.title).toEqual("new")
expect(ticketresponse.body.price).toEqual(100)

})

it("publishes an Event",async()=>{

  const cookie = global.signin()

  const response=await request(app)
  .post(`/api/tickets`)
  .set("Cookie",cookie)
  .send({
    title:"football",
    price:30
  })

  await request(app)
  .put(`/api/tickets/${response.body.id}`)
  .set("Cookie",cookie)
  .send({
    title:"new",
    price:20
  })
  .expect(200)

  expect(natsWrapper.client.publish).toHaveBeenCalled()

})

it("cant update when orderid dosnt exist",async()=>{
  const cookie = global.signin()
 const response=await request(app).post(`/api/tickets`)
 .set("Cookie",cookie)
 .send({
  title:"new",
    price:20
 })
const ticket = await Ticket.findById(response.body.id)

ticket!.set({orderId:new mongoose.Types.ObjectId().toHexString()})
await ticket?.save()

 const updatedtes=await request(app).put(`/api/tickets/${response.body.id}`)
 .set("Cookie",cookie)
 .send({
  title:"new1",
    price:20
 })
expect(400)
})