const models = require('../models');

const Quest = models.Quest;

const makerPage = (req, res) => {
  Quest.QuestModel.findbyOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({
        error: 'An Error has Occured',
      });
    }
    return res.render('app', { csrfToken: req.csrfToken(), quests: docs });
  });
};
const makeQuest = (req, res) => {
  console.log(req.body);
  if (!req.body.questName || !req.body.questExp 
    || !req.body.questType||!req.body.questContent) {
      console.log("here");
    return res.status(400).json({ error: 'All Parameters Are Required For Quest Submission' });
  }
  const questData = {
    name: req.body.questName,
    questType: req.body.questType,
    questExperience: req.body.questExp,
    questContent: req.body.questContent,
    imageName: req.body.imageName,
    owner: req.session.account._id,
  };
  if(req.body.groupName) {
    questData.groupQuest = req.body.groupName;
  }
  
  const newQuest = new Quest.QuestModel(questData);

  const questPromise = newQuest.save();

  questPromise.then(() => res.json({ redirect: '/maker' }));
  questPromise.catch((err) => {
    console.log(err);

    if (err.code === 11000) {
      return res.status(400).json({ error: 'Quest already exists' });
    }

    return res.status(400).json({ error: 'An Error Occurred in Making' });
  });
  return questPromise;
};

const getQuests = (request, response) => {
  const req = request;
  const res = response;
  console.log(req.query.user);
  let userToFind = "";
  if(req.query.user){
    userToFind = req.query.user;
  }
  else {
    userToFind = req.session.account._id;
  }
  console.log("Get Quests for " + userToFind);
  return Quest.QuestModel.findbyOwner(userToFind, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured in Getting' });
    }
    console.log(docs);
    return res.json({ quests: docs });
  });
};

const deleteQuest = (request, response) => {
  const req = request;
  const res = response;
  console.log(req.body);
  return Quest.QuestModel.deleteQuest(req.body, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occured during deletion' });
    }
    // Reload Quests
    return res.json({ quests: docs });
  });
};
/*
const getPendingQuests = (request, response)=>{
  const req = request;
  const res = response;

}
*/
module.exports.makerPage = makerPage;
module.exports.make = makeQuest;
module.exports.getQuests = getQuests;
module.exports.deleteQuest = deleteQuest;
//module.exports.getPendingQuests = getPendingQuests;

