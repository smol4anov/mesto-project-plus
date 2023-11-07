import express from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import { errors } from 'celebrate';
import router from './routes';
import { handleErrors } from './errors';
import { requestLogger, errorLogger } from './middlewares/logger';

require('dotenv').config();

const {
  PORT = 3000,
  BASE_PATH = 'mongodb://localhost:27017/mynewdb',
} = process.env;

mongoose.set('strictQuery', false);
mongoose.connect(BASE_PATH);

const app = express();

app.use(requestLogger);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(handleErrors);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
