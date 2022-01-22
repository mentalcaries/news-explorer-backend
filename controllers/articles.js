const { BadRequest } = require('../errors/bad-request');
const { NotFoundError } = require('../errors/not-found');
const { Unauthorised } = require('../errors/unauthorised');
const Article = require('../models/article');
const { articleNotFound, denyDelete, invalidCard } = require('../utils/constants');

const getArticles = (req, res, next) => {
// find all articles whose owner matches the current user ID
  Article.find({ owner: req.user._id })
    .orFail(() => { throw new NotFoundError(articleNotFound); })
    .then((savedArticles) => {
      res.send(savedArticles);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, text, date, source, link, image,
  } = req.body;
  // Add some check to avoid adding duplicate card.
  Article.create({
    keyword,
    title,
    text,
    date,
    source,
    link,
    image,
    owner: req.user._id,
  })
    .then((article) => res.send({
      data: {
        keyword: article.keyword,
        title: article.title,
        text: article.text,
        date: article.date,
        source: article.source,
        link: article.link,
        image: article.image,
      },
    }))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
// delete article by Id
// user cannot delete other users' articles
  Article.findById(req.params.articleId)
    .orFail(() => { throw new NotFoundError(articleNotFound); })
    .then((savedArticle) => {
      if (req.user._id === savedArticle.owner.toString()) {
        Article.findByIdAndRemove(req.params.articleId)
          // .orFail()
          .then((deletedArticle) => res.send({ data: deletedArticle }))
          .catch(next);
      } else throw new Unauthorised(denyDelete);
    })
    .catch(() => { next(new BadRequest(invalidCard)); });
};

module.exports = { getArticles, createArticle, deleteArticle };
