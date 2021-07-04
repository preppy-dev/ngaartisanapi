import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import data from '../db/data';
import Prestation from '../models/prestationModel';
import User from '../models/userModel.js';
import { isModeratorOrAdmin , isAdmin, isAuth } from '../helpers/utils.js';
import Category from '../models/categoryModel'

const prestationRouter = express.Router();

prestationRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = 3;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const category = req.query.category || '';
    /* const order = req.query.order || '';
    const min =
      req.query.min && Number(req.query.min) !== 0 ? Number(req.query.min) : 0;
    const max =
      req.query.max && Number(req.query.max) !== 0 ? Number(req.query.max) : 0;
    const rating =
      req.query.rating && Number(req.query.rating) !== 0
        ? Number(req.query.rating)
        : 0;
 */
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const categoryFilter = category ? { category } : {};
   /*  const priceFilter = min && max ? { price: { $gte: min, $lte: max } } : {}; */
    /* const sortOrder =
      order === 'lowest'
        ? { price: 1 }
        : order === 'highest'
        ? { price: -1 }
        : order === 'toprated'
        ? { rating: -1 }
        : { _id: -1 }; */
    const count = await Prestation.count({
      ...nameFilter,
      ...categoryFilter,
    });
    const prestations = await Prestation.find({
      ...nameFilter,
      ...categoryFilter,
    })
      /* .sort(sortOrder) */
      .skip(pageSize * (page - 1))
      .limit(pageSize);
    res.send({ prestations, page, pages: Math.ceil(count / pageSize) });
  })
);

prestationRouter.get(
  '/reservation/:prestation',
  expressAsyncHandler(async (req, res) => {
    const categoryId = await Category.findOne({link:req.params.prestation});
    /* const categoryId = await Category.find().distinct(req.params.prestation); */
    const prestations = await Prestation.find({category:categoryId._id});
    /* const category = categoryId */
    res.send(prestations);
    /* res.send({prestations:prestations,category:categoryId}); */
  })
);

prestationRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
    // await Product.remove({});
      const prestations = data.prestations.map((prestation) => ({
        ...prestation
      }));
      const createdPrestations = await Prestation.insertMany(prestations);
      res.send({ createdPrestations });
  })
);

prestationRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const prestation = await Prestation.findById(req.params.id)
    if (prestation) {
      res.send(prestation);
    } else {
      res.status(404).send({ message: 'Prestation Not Found' });
    }
  })
);


prestationRouter.post(
  '/',
  isAuth,
  isModeratorOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const prestation = new Prestation({
      name: 'sample name ' + Date.now(),
      description: 'sample description',
    });
    const createdPrestation = await prestation.save();
    res.send({ message: 'Prestation Created', prestation: createdPrestation });
  })
);
prestationRouter.put(
  '/:id',
  isAuth,
  isModeratorOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const prestationId = req.params.id;
    const prestation = await Prestation.findById(prestationId);
    if (prestation) {
      prestation.name = req.body.name;
      prestation.category = req.body.category;
      prestation.description = req.body.description;
      const updatedPrestation = await prestation.save();
      res.send({ message: 'Prestation Updated', prestation: updatedPrestation });
    } else {
      res.status(404).send({ message: 'Prestation Not Found' });
    }
  })
);

prestationRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const prestation = await Prestation.findById(req.params.id);
    if (prestation) {
      const deletePrestation = await prestation.remove();
      res.send({ message: 'Prestation Deleted', prestation: deletePrestation });
    } else {
      res.status(404).send({ message: 'Prestation Not Found' });
    }
  })
);

prestationRouter.post(
  '/:id/types',
  isAuth,
  isModeratorOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const prestationId = req.params.id;
    const prestation = await Prestation.findById(prestationId);
    if (prestation) {
      const type = {
        name: req.body.typeName,
        price: Number(req.body.price),
        description: req.body.typeDescription,
      };
      prestation.types.push(type);
      const updatedPrestation = await prestation.save();
      res.status(201).send({
        message: 'Prestation Created',
        type: updatedPrestation.types[updatedPrestation.types.length - 1],
      });
    } else {
      res.status(404).send({ message: 'Prestation Not Found' });
    }
  })
);

export default prestationRouter;
