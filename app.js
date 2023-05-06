const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middleware/logger');
const auth = require('./middleware/auth');
const { localdb } = require('./utils/config');
const { limiter } = require('./middleware/limiter');

const app = express();
app.use(helmet());
app.use(cors());
app.options('*', cors());
app.use(limiter);
const { PORT = 3000, NODE_ENV, MONGO_URL } = process.env;

mongoose.connect(NODE_ENV === 'production' ? MONGO_URL : localdb);
app.use(express.json());

const mainRouter = require('./routes/index');
const { login, createUser } = require('./controllers/users');
const { errorHandler } = require('./middleware/error');
const { registerUser, loginUser } = require('./middleware/validateUser');

app.use(requestLogger);

app.post('/signup', registerUser, createUser);

app.post('/signin', loginUser, login);

app.use('/', auth, mainRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${PORT}`);
});

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

module.exports = app;
