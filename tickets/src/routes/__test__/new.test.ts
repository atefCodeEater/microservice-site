import { cookie } from "express-validator";
import request from "supertest";
import {app} from "../../app";
import { Ticket} from "../../model/ticket";
import {  natsWrapper} from "../../nats-wrapper";


it("404",async()=>{
  const response = await request(app)
  .post("/api/tickets")
  .send({})
  expect(response.status).not.toEqual(404)
})

it("not aurthorize signin 401",async()=>{
  const response = await request(app)
  .post("/api/tickets")
  .send({})
  expect(response.status).toEqual(401)
})

it(" aurthorize signin",async()=>{
  const response = await request(app)
  .post("/api/tickets")
  .set("Cookie",global.signin())
  .send({})
  expect(response.status).not.toEqual(401)
})


it("ceated ticket",async()=>{

  let tickets = await Ticket.find({});
  expect(tickets.length).toEqual(0)
    let title="sports"
await request(app)
.post("api/tickets")
.set("Cookie",global.signin())
.send({
  title,
  price:20
})
.expect(201)
tickets = await Ticket.find({});
  expect(tickets.length).toEqual(1);
  expect(tickets[0].title).toEqual(title);


})

it("publishes an Event",async()=>{
  let title="sports"

await request(app)
.post("api/tickets")
.set("Cookie",global.signin())
.send({
  title,
  price:20
})
.expect(201)

expect(natsWrapper.client.publish).toHaveBeenCalled()

})