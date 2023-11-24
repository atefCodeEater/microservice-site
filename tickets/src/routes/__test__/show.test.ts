import request from "supertest";
import {app} from "../../app";
import mongoose from "mongoose";



it("return 404 if ticket not exist",async()=>{

  const id =new mongoose.Types.ObjectId().toHexString()
await request(app)
.get(`/api/ticket/${id}`)
.send()
expect(404)
})


it("return 201 if ticket is exist",async()=>{
const title="sport"
const price=20

const response=await request(app)
.post("/api/ticket")
.set("Cookie",global.signin())
.send({
  title,
  price
})
.expect(201)

const ticketResponce=await request(app)
.get(`/api/ticket/${response.body.id}`)
.send()
.expect(200)

expect(ticketResponce.body.title).toEqual(title)
expect(ticketResponce.body.price).toEqual(price)

  })