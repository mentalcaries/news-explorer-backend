const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/aroundb');
app.use(express.json());

const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

app.use('/cards', articleRouter);

app.use('/users', userRouter);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${PORT}`);
});
