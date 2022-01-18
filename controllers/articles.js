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
  Article.create({
    keyword, title, description, date, source, link, image, owner: req.user._id,
  })
    .then((article) => res.send(article))
    .catch(next);
};

const deleteArticle = (req, res, next) => {
// delete article by Id
// user cannot delete other users' articles
  console.log(req);
  Article.findById({ _id: req.params })
    .orFail(() => { throw new Error('Card does not exist'); })
    .then((savedArticle) => {
      if (req.user._id === savedArticle.owner._id.toString()) {
        Article.findByIdAndRemove({ _id: req.params })
          .orFail()
          .then((deletedArticle) => res.send({ date: deletedArticle }));
        // .catch(next);
      }
    })
    .catch(() => {
      next(new Error('You cannot delete that!'));
    });
};

module.exports = { getArticles, createArticle, deleteArticle };
