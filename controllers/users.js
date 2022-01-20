const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { BadRequest } = require('../middleware/errors/bad-request');
const { Unauthorised } = require('../middleware/errors/unauthorised');
const { Conflict } = require('../middleware/errors/conflict');
const { NotFoundError } = require('../middleware/errors/not-found');

const { NODE_ENV, JWT_SECRET } = process.env;

const getCurrentUser = (req, res, next) => {
  console.log(req.body.user._id);
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError('User does not exist');
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
        throw new Conflict('That email address is already in use');
      }
      if (!email || !password) {
        throw new BadRequest('Invalid email or password');
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
        throw new Unauthorised('Email or password incorrect');
      } else {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret-key', { expiresIn: '5d' });
        res.send({ token });
      }
    })
    .catch(() => {
      next(new Unauthorised('That email or password shall not pass!'));
    });
};

module.exports = { getCurrentUser, createUser, login };
