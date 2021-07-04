import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Devis from '../models/devisModel.js';
import User from '../models/userModel.js';
import {
  isAdmin,
  isAuth,
  isModeratorOrAdmin,
  mailgun,
  payOrderEmailTemplate,
} from '../helpers/utils.js';

const devisRouter = express.Router();
devisRouter.get(
  '/',
  isAuth,
  isModeratorOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const devis = await Devis.find();
    res.send(devis);
  })
);

devisRouter.get(
  '/summary',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const orders = await Order.aggregate([
      {
        $group: {
          _id: null,
          numOrders: { $sum: 1 },
          totalSales: { $sum: '$totalPrice' },
        },
      },
    ]);
    const users = await User.aggregate([
      {
        $group: {
          _id: null,
          numUsers: { $sum: 1 },
        },
      },
    ]);
    const dailyOrders = await Order.aggregate([
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          orders: { $sum: 1 },
          sales: { $sum: '$totalPrice' },
        },
      },
      { $sort: { _id: 1 } },
    ]);
    const productCategories = await Product.aggregate([
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
        },
      },
    ]);
    res.send({ users, orders, dailyOrders, productCategories });
  })
);


devisRouter.post(
  '/',
  expressAsyncHandler(async (req, res) => {
      const devis = new Devis({
        category: req.body.name,
        description: req.body.description,
        date: req.body.date,
        adresse: req.body.adresse,
        contact: {
          fullName:req.body.fullName,
          email:req.body.email,
          phone:req.body.phone,
        },
        cniRecto: req.body.cniRecto,
        cniVerso: req.body.cniVerso,
      });
      const createdDevis = await devis.save();
      res
        .status(201)
        .send({ message: 'New Devis Order Created', devis: createdDevis });
 
  })
);

devisRouter.get(
  '/:id',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const devis = await Devid.findById(req.params.id);
    if (devis) {
      res.send(devis);
    } else {
      res.status(404).send({ message: 'Devis Not Found' });
    }
  })
);

devisRouter.put(
  '/:id/pay',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'email name'
    );
    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      };
      const updatedOrder = await order.save();
      mailgun()
        .messages()
        .send(
          {
            from: 'Amazona <amazona@mg.yourdomain.com>',
            to: `${order.user.name} <${order.user.email}>`,
            subject: `New order ${order._id}`,
            html: payOrderEmailTemplate(order),
          },
          (error, body) => {
            if (error) {
              console.log(error);
            } else {
              console.log(body);
            }
          }
        );
      res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

devisRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const devis = await Devis.findById(req.params.id);
    if (devis) {
      const deleteDevis = await devis.remove();
      res.send({ message: 'devis Deleted', devis: deleteDevis });
    } else {
      res.status(404).send({ message: 'Devis Not Found' });
    }
  })
);

devisRouter.put(
  '/:id/deliver',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);
    if (order) {
      order.isDelivered = true;
      order.deliveredAt = Date.now();

      const updatedOrder = await order.save();
      res.send({ message: 'Order Delivered', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
  })
);

export default devisRouter;
