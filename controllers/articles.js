const { BadRequest } = require('../middleware/errors/bad-request');
const { Unauthorised } = require('../middleware/errors/unauthorised');
const Article = require('../models/article');

const getArticles = (req, res, next) => {
// find all articles whose owner matches the current user ID
console.log(req.user._id);
  Article.find({ owner: req.user._id })
    .orFail()
    .then((savedArticles) => {
      res.send(savedArticles);
    })
    .catch(next);
};

const createArticle = (req, res, next) => {
  const {
    keyword, title, description, date, source, link, image,
  } = req.body;
  // Add some check to avoid adding duplicate card.
  Article.findOne({ date, link })
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
        owner: req.user._id,
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
  Article.findById(req.params.articleId)
    .orFail()
    .then((savedArticle) => {
      if (req.user._id === savedArticle.owner.toString()) {
        Article.findByIdAndRemove(req.params.articleId)
          // .orFail()
          .then((deletedArticle) => res.send({ data: deletedArticle }))
          .catch(next);
      } else throw new Unauthorised('That\'s not yours to delete');
    })
    .catch(next);
};

module.exports = { getArticles, createArticle, deleteArticle };
