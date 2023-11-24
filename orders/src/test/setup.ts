import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import request from 'supertest';
import jwt from 'jsonwebtoken';

import { app } from '../app';

declare global {
  namespace NodeJS {
    interface Global {
      signin(): string[];
    }
  }
}
jest.mock('../__mocks__/nats-wrapper.ts')


let mongo: any;
beforeAll(async () => {
  process.env.JWT_KEY = 'asdfasdf';
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  mongo = new MongoMemoryServer();
  const mongoUri = await mongo.getUri();

  await mongoose.connect(mongoUri, {
  });
});

beforeEach(async () => {
  jest.clearAllMocks()
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signin =()=> {

  //Build jwt payload 

  const payload = {
    id:new mongoose.Types.ObjectId().toHexString(),
    email:"test@test.com"
  }

  //create jwt

  const token= jwt.sign(payload,process.env.JWT_KEY!)

  //Build session

  const session={jwt:token}

  // turn that session into json

  const sessionjson = JSON.stringify(session) 


  //json encode it as base64

  const base64 = Buffer.from(sessionjson).toString('base64')

  return [`express:sess=${base64}`];
};
