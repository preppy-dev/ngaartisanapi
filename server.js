import express from 'express';
import mongoose from 'mongoose';
import env from './env';
import cors from 'cors';
import path from 'path';
import userRouter from './app/routers/usersRouter';
import categoryRouter from './app/routers/categoryRouter';
import prestationRouter from './app/routers/prestationRouter';
import index from './app/routers/index';
import uploadRouter from './app/routers/uploadRouter';
import devisRouter from './app/routers/devisRouter';
//import orderRouter from './app/routers/orderRouter';
import orderRouter from './app/routers/orderGuestRouter';


const app = express();
app.use(express.json());
/* app.use(express.json({ type: 'application/vnd.api+json' })); */
app.use(express.urlencoded({ extended: true }));
app.use(cors());

mongoose.connect(env.database_url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});


/* app.use(index); */
app.use('/api/uploads', uploadRouter);
app.use('/api/users', userRouter);
app.use('/api/category', categoryRouter);
app.use('/api/prestation', prestationRouter);
app.use('/api/devis', devisRouter);
app.use('/api/orders', orderRouter);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));
app.use(express.static(path.join(__dirname, './app/screens')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, './app/screens/index.html'))
);


app.listen(env.port).on('listening', () => {
  console.log(`🚀 are live on ${env.port}`);
});