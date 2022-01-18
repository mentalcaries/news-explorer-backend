const express = require('express');
const mongoose = require('mongoose');

const app = express();

mongoose.connect('mongodb://localhost:27017/newsx');
app.use(express.json());

const { PORT = 3000 } = process.env;
const userRouter = require('./routes/users');
const articleRouter = require('./routes/articles');

// app.use((req, res, next) => {
//   req.user = {
//     _id: '61e6aefe17929d486d4c77dez',
//   };

//   next();
// });

app.use('/cards', articleRouter);

app.use('/users', userRouter);

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

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Server is running on ${PORT}`);
});
