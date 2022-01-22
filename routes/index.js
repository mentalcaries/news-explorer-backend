const express = require('express');
const articleRouter = require('./articles');
const userRouter = require('./users');

const router = express.Router();

router.use('/articles', articleRouter);
router.use('./users', userRouter);

module.exports = router;
