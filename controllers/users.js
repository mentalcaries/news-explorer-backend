const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequest } = require('../errors/bad-request');
const { Unauthorised } = require('../errors/unauthorised');
const { Conflict } = require('../errors/conflict');
const { NotFoundError } = require('../errors/not-found');
const { devkey } = require('../utils/config');
const {
  noUser, emailUsed, invalidEmailPassword, incorrectEmailPassword,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(noUser);
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

const createUser = (req, res, next) => {
  const { email, password, name } = req.body;
  User.findOne({ email })
    .then((user) => {
      if (user) {
        throw new Conflict(emailUsed);
      }
      if (!email || !password) {
        throw new BadRequest(invalidEmailPassword);
      }
      return bcrypt.hash(password, 10, (err, hash) => {
        User.create({
          email, name, password: hash,
        })
          .then((userData) => {
            res.send({
              data: {
                email: userData.email,
                name: userData.name,
              },
            });
          })
          .catch(next);
      });
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      if (!user) {
        throw new Unauthorised(incorrectEmailPassword);
      } else {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : devkey, { expiresIn: '5d' });
        res.send({ token });
      }
    })
    .catch(() => {
      next(new Unauthorised(invalidEmailPassword));
    });
};

module.exports = { getCurrentUser, createUser, login };
