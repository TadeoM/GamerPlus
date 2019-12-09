
const dungeonPage = (req, res) => {
    res.render('dungeonComplete', { csrfToken: req.csrfToken() });
  };

  
module.exports.dungeonComplete = dungeonPage;