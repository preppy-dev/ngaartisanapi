import jwt from 'jsonwebtoken';
import mg from 'mailgun-js';
import env from './../../env';


export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      isAdmin: user.isAdmin,
      isModerator: user.isModerator,
      isArtisan: user.isArtisan,
    },
    env.secret,
    {
      expiresIn: '30d',
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX
    jwt.verify(
      token,
      env.secret ,
      (err, decode) => {
        if (err) {
          res.status(401).send({ message: 'Invalid Token' });
        } else {
          req.user = decode;
          next();
        }
      }
    );
  } else {
    res.status(401).send({ message: 'No Token' });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin Token' });
  }
};

export const isArtisan = (req, res, next) => {
  if (req.user && req.user.isArtisan) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Artisan Token' });
  }
};
export const isModeratorOrAdmin = (req, res, next) => {
  if (req.user && (req.user.isModerator || req.user.isAdmin)) {
    next();
  } else {
    res.status(401).send({ message: 'Invalid Admin/Moderator Token' });
  }
};