const express = require('express');
const mongoose = require('mongoose');
const { celebrate, Joi, errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');

const app = express();
app.use(helmet());
app.use(cors());
app.options('*', cors());

mongoose.connect('mongodb://localhost:27017/newsx');
app.use(express.json());

const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');
const { login, createUser } = require('./controllers/users');

app.use(requestLogger);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(30),
  }),
}), createUser);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);

app.use('/articles', auth, articleRouter);

app.use('/users', auth, userRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${PORT}`);
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'An error occurred on the server'
        : message,
    });
});
