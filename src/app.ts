import express from 'express';
import cors from 'cors';
import { exception, notFound } from './middlewares/errors';

const app = express();

app.use(cors());

app.use(notFound);
app.use(exception);

export default app;
