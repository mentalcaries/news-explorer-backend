const User = require('../models/user');

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .then((user) => {
      if (!user) {
        console.log('No User with that ID Found');
      }
      return res.status(200).send(user);
    })
    .catch(next);
};

module.exports = { getCurrentUser };
