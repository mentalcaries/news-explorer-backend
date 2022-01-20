const express = require('express');
const { Joi, celebrate } = require('celebrate');
const validator = require('validator')

const router = express.Router();

const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

function validateUrl(string) {
  if (!validator.isURL(string)) {
    throw new Error('Invalid URL');
  }
  return string;
}

router.get('/', getArticles);

router.post('/', celebrate({
  body: Joi.object().keys({
    keyword: Joi.string().required(),
    title: Joi.string().required(),
    description: Joi.string().required(),
    date: Joi.string().required(),
    source: Joi.string().required(),
    link: Joi.string().required().custom(validateUrl),
    image: Joi.string().required().custom(validateUrl),
    owner: Joi.string().hex().length(24),
  })
}), createArticle);

router.delete('/:articleId', celebrate({
  body: Joi.object().keys({
    _id: Joi.string().hex().length(24),
  }),
}), deleteArticle);

module.exports = router;
