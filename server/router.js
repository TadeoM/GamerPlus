const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getToken', mid.requiresSecure, controllers.Account.getToken);
    // add after fix up to 30
  app.get('/getAccount', mid.requiresSecure, controllers.Account.getAccount);
  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);
  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);
  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Quest.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Quest.make);

  app.get('/creator', mid.requiresLogin, controllers.Account.creatorPage);
  app.post('/creator', mid.requiresLogin, controllers.Account.createStats);

  app.get('/profile', mid.requiresLogin, controllers.Friend.profilePage);
  app.get('/getFriends', mid.requiresLogin, controllers.Friend.getFriends);
  app.post('/addFriend', mid.requiresLogin, controllers.Friend.addFriend);

  app.post('/levelUp', mid.requiresLogin, controllers.Account.LevelUp);

  app.get('/getQuests', mid.requiresLogin, controllers.Quest.getQuests);
  app.get('/getGroupQuests', mid.requiresLogin, controllers.Quest.getGroupQuests);
  app.post('/deleteQuest', mid.requiresLogin, controllers.Quest.deleteQuest);
  app.post('/changePswd', mid.requiresLogin, controllers.Account.changePassword);

    // Images get uploaded using /upload
  app.post('/upload', mid.requiresLogin, controllers.FileUpload.upload);
    // Images can be retrieved using /retrieve?name=THE_FILE_NAME_WITH_EXTENSION
  app.get('/retrieve', mid.requiresLogin, controllers.FileUpload.retrieve);
  app.get('/uploadPage', mid.requiresLogin, controllers.FileUpload.uploadPage);

  app.post('/addMember', mid.requiresLogin, controllers.Group.addMember);
  app.get('/getGroup', mid.requiresLogin, controllers.Group.getOneGroup);
  app.get('/getGroups', mid.requiresLogin, controllers.Group.getGroups);
  app.get('/groupPage', mid.requiresLogin, controllers.Group.groupPage);

    // Dungeons
  app.get('/dungeonComplete', mid.requiresLogin, controllers.Dungeon.dungeonComplete);
  app.post('/getReward', mid.requiresLogin, controllers.Account.getReward);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
