const models = require('../models');

const Account = models.Account;

const dungeonPage = (req, res) => {
    res.render('dungeonComplete', { csrfToken: req.csrfToken() });
  };

  const getReward = (req, res) => {
    
  };

module.exports.getReward = getReward;
module.exports.dungeonComplete = dungeonPage;