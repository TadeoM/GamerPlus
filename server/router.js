const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
    // add after fix up to 30
  app.get('/getQuests', mid.requiresLogin, controllers.Quest.getQuests);
  app.get('/getAccount', mid.requiresSecure, controllers.Account.getAccount);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);
  app.get('/maker', mid.requiresLogin, controllers.Quest.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Quest.make);
  app.get('/deleteQuest',mid.requiresLogin, controllers.Quest.deleteQuest);
  app.get('/creator', mid.requiresLogin, controllers.Account.creatorPage);
  app.post('/creator', mid.requiresLogin, controllers.Account.createStats);
  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
