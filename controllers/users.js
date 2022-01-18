const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const User = require('../models/user');
const { BadRequest } = require('../middleware/errors/bad-request');
const { Unauthorised} = require('../middleware/errors/unauthorised');
const { Conflict } = require('../middleware/errors/conflict');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        console.log('No User with that ID Found');
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
        throw new Conflict('Try another email');
      }
    });
  if (!email || !password) {
    throw new BadRequest('Missing email or password');
  }
  return bcrypt.hash(password, 10, (err, hash) => {
    User.create({
      email, name, password: hash,
    })
      .then((user) => {
        res.send({
          data: {
            email: user.email,
            name: user.name,
          },
        });
      })
      .catch(next);
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return User.findUserbyCredentials(email, password)
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
