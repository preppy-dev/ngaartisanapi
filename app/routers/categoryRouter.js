import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import Category from '../models/categoryModel'
import { isModeratorOrAdmin , isAdmin, isAuth } from '../helpers/utils.js';

const categoryRouter = express.Router();

categoryRouter.get(
  '/',
  expressAsyncHandler(async (req, res) => {
    const pageSize = Number(req.query.pageSize) || 3;
    const page = Number(req.query.pageNumber) || 1;
    const name = req.query.name || '';
    const nameFilter = name ? { name: { $regex: name, $options: 'i' } } : {};
    const count = await Category.count({
      ...nameFilter,
    });

    const categories = await Category.find({
      ...nameFilter,
    })
    .skip(pageSize * (page - 1))
    .limit(pageSize);
    res.send({categories,page,pages: Math.ceil(count / pageSize) });
  })
);

categoryRouter.get(
  '/categories',
  expressAsyncHandler(async (req, res) => {
    const categories = await Category.find({});
    res.send(categories);
  })
);

categoryRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (category) {
      res.send(category);
    } else {
      res.status(404).send({ message: 'Category Not Found' });
    }
    res.send(category);
  })
);


categoryRouter.post(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = new Category({
      name: 'sample name ' + Date.now(),
      icon: 'sample icon',
      image: 'sample image',
      description: 'sample description',
    });
    const createdCategory = await category.save();
    res.send({ message: 'Category Created', category: createdCategory });
  })
);

categoryRouter.put(
  '/:id',
  isAuth,
  isModeratorOrAdmin,
  expressAsyncHandler(async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    if (category) {
      category.name = req.body.name;
      category.link = req.body.link;
      category.icon = req.body.icon;
      category.image = req.body.image;
      category.description = req.body.description;
      const updatedCategory = await category.save();
      res.send({ message: 'Category Updated', category: updatedCategory });
    } else {
      res.status(404).send({ message: 'Category Not Found' });
    }
  })
);

categoryRouter.get(
  '/:prestation',
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findOne(req.params.prestation);
    /* const  category = await Category.findOne({link:req.params.prestation});  */
    res.send(category);
  })
);


categoryRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
    if (category) {
      const deleteCategory = await category.remove();
      res.send({ message: 'Category Deleted', category: deleteCategory });
    } else {
      res.status(404).send({ message: 'Category Not Found' });
    }
  })
);


export default categoryRouter;