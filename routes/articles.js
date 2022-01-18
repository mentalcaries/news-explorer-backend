const express = require('express');

const router = express.Router();

const { getArticles, createArticle, deleteArticle } = require('../controllers/articles');

router.get('/', getArticles);

router.post('/', createArticle);

router.delete('/articleId', deleteArticle);

module.exports = router;
