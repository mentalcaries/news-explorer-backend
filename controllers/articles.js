const mongoose = require('mongoose');
const { BadRequest } = require('../middleware/errors/bad-request');
const { NotFoundError } = require('../middleware/errors/not-found');
const { Unauthorised } = require('../middleware/errors/unauthorised');
const Article = require('../models/article');

const getArticles = (req, res, next) => {
// find all articles whose owner matches the current user ID
  Article.find(req.owner)
    .orFail()
    .then((savedArticles) => {
      res.send(savedArticles);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
// create article from card data
  const {
    keyword, title, description, date, source, link, image,
  } = req.body;

  // Add some check to avoid adding duplicate card.
  Article.findOne({ date, title })
    .then((articleCard) => {
      if (articleCard) {
        throw new BadRequest('Card already exists');
      }
      return Article.create({
        keyword,
        title,
        description,
        date,
        source,
        link,
        image,
        // owner
      })
        .then((article) => res.send({
          data: {
            keyword: article.keyword,
            title: article.title,
            description: article.description,
            date: article.date,
            source: article.source,
            link: article.link,
            image: article.image,
          },
        }))
        .catch(next);
    })
    .catch(next);
};

const deleteArticle = (req, res, next) => {
// delete article by Id
// user cannot delete other users' articles
  Article.findById({ _id: req.params })
    .orFail(() => { throw new NotFoundError('Card does not exist'); })
    .then((savedArticle) => {
      if (req.user._id === savedArticle.owner._id.toString()) {
        Article.findByIdAndRemove({ _id: req.params })
          .orFail()
          .then((deletedArticle) => res.send({ date: deletedArticle }));
        // .catch(next);
      }
    })
    .catch(() => {
      next(new Unauthorised('You have no power to delete that!'));
    });
};

module.exports = { getArticles, createArticle, deleteArticle };
