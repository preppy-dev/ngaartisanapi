import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs';
import data from '../db/data.js';
import User from '../models/userModel.js';
import { generateToken, isAdmin, isAuth } from '../helpers/utils.js';

const userRouter = express.Router();

userRouter.get(
  '/top-artisan',
  expressAsyncHandler(async (req, res) => {
    const topArtisans = await User.find({ isArtisan: true })
      .sort({ 'artisan.rating': -1 })
      .limit(3);
    res.send(topArtisans);
  })
);

userRouter.get(
  '/seed',
  expressAsyncHandler(async (req, res) => {
     await User.remove({});
    const createdUsers = await User.insertMany(data.users);
    res.send({ createdUsers });
  })
);

userRouter.post(
  '/register',
  expressAsyncHandler(async (req, res) => {
    const user = new User({
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      profil : req.body.profil ,
      username : req.body.firstname + req.body.lastname,
      password: bcrypt.hashSync(req.body.password, 8),
    });
    const createdUser = await user.save();
    res.send({
      _id: createdUser._id,
      firstname: createdUser.firstname,
      lastname: createdUser.lastname,
      email: createdUser.email,
      profil : createdUser.profil,
      username :createdUser.username,
      isAdmin: createdUser.isAdmin,
      isModerator: user.isModerator,
      isArtisan: user.isArtisan,
      token: generateToken(createdUser),
    });
  })
);

userRouter.post(
  '/signin',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      if (bcrypt.compareSync(req.body.password, user.password)) {
        res.send({
          _id: user._id,
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          profil : user.profil,
          username :user.username,
          isAdmin: user.isAdmin,
          isModerator: user.isModerator,
          isArtisan: user.isArtisan,
          token: generateToken(user),
        });
        return;
      }
    }
    res.status(401).send({ message: 'Invalid email or password' });
  })
);



userRouter.get(
  '/:id',
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);



userRouter.put(
  '/profile',
  isAuth,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
      user.firstname = req.body.firstname || user.firstname;
      user.lastname = req.body.lastname || user.lastname;
      user.email = req.body.email || user.email;
      user.profil = req.body.profil || user.profil;
      user.username = req.body.username || user.username;
      if (req.body.password) {
        user.password = bcrypt.hashSync(req.body.password, 8);
      }
      const updatedUser = await user.save();
      res.send({
        _id: updatedUser._id,
        firstname: updatedUser.firstname,
        lastname: updatedUser.lastname,
        email: updatedUser.email,
        profil : updatedUser.profil,
        username :updatedUser.username,
        isAdmin: updatedUser.isAdmin,
        isModerator: user.isModerator,
        isArtisan: user.isArtisan,
        token: generateToken(updatedUser),
      });
    }
  })
);

userRouter.get(
  '/',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const users = await User.find({});
    res.send(users);
  })
);

userRouter.delete(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      if (user.email === 'admin@example.com') {
        res.status(400).send({ message: 'Can Not Delete Admin User' });
        return;
      }
      const deleteUser = await user.remove();
      res.send({ message: 'User Deleted', user: deleteUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);

userRouter.put(
  '/:id',
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);
    if (user) {
      user.firstname = req.body.firstname || user.firstname;
      user.lastname = req.body.lastname || user.lastname;
      user.email = req.body.email || user.email;
      user.isAdmin = Boolean(req.body.isAdmin);
      user.isModerator = Boolean(req.body.isModerator);
      user.isArtisan = Boolean(req.body.isArtisan);
      // user.isAdmin = req.body.isAdmin || user.isAdmin;
      const updatedUser = await user.save();
      res.send({ message: 'User Updated', user: updatedUser });
    } else {
      res.status(404).send({ message: 'User Not Found' });
    }
  })
);




export default userRouter;
