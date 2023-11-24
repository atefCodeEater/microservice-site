import express from 'express';
import 'express-async-errors';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';
import {createTicketRouter} from './routes/new';
import {showTicket} from './routes/show';
import {indexTicketsRouter} from './routes/index';
import {updateTicketRouter} from './routes/update';






import { errorHandler ,NotFoundError,currentUser} from '@ateftickets/common';
 

const app = express();
app.set('trust proxy', true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: false
  })
);
app.use(currentUser)
app.use(createTicketRouter)
app.use(showTicket)
app.use(indexTicketsRouter)
app.use(updateTicketRouter)




app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app };
